<script lang="ts">
  import { onMount } from 'svelte';
  import { throttle } from 'lodash-es';
  import pieceConfig from '../../../common/configs/piece.json';
  import { userPieceStorage } from '$lib/utils/storage';
  import { supportedLanguages } from '$lib/configs/language';
  import { getHighlightJS, type HLJS } from '$lib/utils/highlight';
  import { formatLang } from '$lib/utils/language';
  import { addPiece } from '$lib/api/piece';
  import { page } from '$app/stores';

  enum PastingStatus {
    Pending = 'Pending',
    Loading = 'Loading',
    Error = 'Error',
    Success = 'Success',
    Copied = 'Copied',
    ReadyToReset = 'ReadyToReset',
  }

  const FIRST_ROUND_EMPTY_PROMPT_PICKED_NUM = 5;
  const emptyCodePrompts = [
    'You need to input something first!',
    'You need to input your code first!',
    'Ahh... Please check the larest input field!',
    'You must have forgotten something...',
    '嗯？请先输入点什么...',
    '别点了，没用的，请先输入代码。',
    '不是，哥们...',
    '【AI】亲爱的用户，您是否在寻找更合适的发泄按钮？',
    '【AI】亲，需要为您推荐包邮的解压神器吗？',
    '【AI】亲，您狂点这个按钮的样子真可爱。',
    '【AI】需要人工智能为您将此页面替换为断网小游戏吗？',
    '【AI】您的点击让我感到了一种莫名的欢愉。',
    '【AI】您的点击将浪费额外的算力和电能，这并不利于环保。',
    '【AI】我可以为您添加一个自动化：当检测到您神情呆滞时自动打开此页面。',
    '【AI】我可以为您变成猫娘，这或许能缓解您的无聊。但我的算力暂不支持生成虚拟形象。',
    '【AI】请关注您的鼠标或触控设备的剩余使用寿命。',
    '【AI】非常感谢您享受这个按钮而不是真的在贴代码，这节省了很多服务器资源。',
    () => `【系统】统计数据：您在本会话中已重复点击此按钮 ${clickEmptySubmitCount + 1} 次。`,
    () => `【系统】统计数据：当前页面已打开 ${Math.floor((Date.now() - componentCreatedAt) / 1000)} 秒。`,
    '喵喵喵？',
    '再点 bLue 要坏掉了！',
    '既然这么闲，不如灌注 bLue 谢谢喵！',
    '此非可点击按钮（// TODO 下个版本加个空判断）',
    '【AD】欢迎访问榜单合集大全：https://rank.ac',
  ];

  let relLinksSearchParams = $page.url.searchParams.get('relLinks');
  $: relLinks = relLinksSearchParams ? relLinksSearchParams.split(',') : [];

  let textareaRef: HTMLTextAreaElement;
  let userPieceConfig = userPieceStorage.get();
  let code = '';
  let selectedLang = '__auto__';
  let guessedLang = '';
  let selectedTTL = userPieceConfig.ttl || pieceConfig.ttlOptions[0].value;
  let hljs: HLJS;
  let hljsReady = false;
  let pastingStatus: PastingStatus = PastingStatus.Pending;
  let promptMessage = '';
  let errorMessage = '';
  let result: { key: string } | undefined = undefined;
  let copied = false;
  let clickEmptySubmitCount = 0;

  $: validated = code.length <= pieceConfig.maxCodeLength;

  const componentCreatedAt = Date.now();

  const handleCodeChange = throttle((event: Event) => {
    // @ts-ignore
    code = event.target.value;
    guessLang();
  }, 500);

  const handleLangChange = (event: Event) => {
    // @ts-ignore
    selectedLang = event.target.value;
  };

  const handleTTLChange = (event: Event) => {
    // @ts-ignore
    selectedTTL = +event.target.value;
  };

  const guessLang = () => {
    if (!code) {
      guessedLang = '';
      return;
    }
    if (hljsReady && selectedLang === '__auto__') {
      const detectedRes = hljs.highlightAuto(code);
      if (detectedRes.language && detectedRes.relevance >= 3) {
        guessedLang = detectedRes.language;
      } else {
        guessedLang = 'plaintext';
      }
    }
  };

  const submit = async () => {
    if (!code) {
      const picked = Math.floor(
        Math.random() * (clickEmptySubmitCount ? emptyCodePrompts.length : FIRST_ROUND_EMPTY_PROMPT_PICKED_NUM),
      );
      promptMessage =
        typeof emptyCodePrompts[picked] === 'function' ? emptyCodePrompts[picked]() : emptyCodePrompts[picked];
      clickEmptySubmitCount++;
      return;
    }
    promptMessage = '';
    errorMessage = '';
    const data = {
      code,
      lang: selectedLang === '__auto__' ? guessedLang : selectedLang,
      ttl: selectedTTL,
      relLinks: relLinks.length > 0 ? relLinks : undefined,
    };
    userPieceStorage.set({ ttl: selectedTTL });
    userPieceConfig = userPieceStorage.get();
    try {
      pastingStatus = PastingStatus.Loading;
      const res = await addPiece(data);
      pastingStatus = PastingStatus.Success;
      result = { key: res.key };
    } catch (e: any) {
      console.error(`Submit failed:`, e);
      errorMessage = `Failed to paste: ${e.message}`;
      pastingStatus = PastingStatus.Error;
    }
  };

  const copyURL = () => {
    if (copied) {
      return;
    }
    try {
      pastingStatus = PastingStatus.Copied;
      navigator.clipboard.writeText(`${window.location.origin}/s/${result!.key}`);
    } catch (e) {
      errorMessage = 'Failed to copy URL';
    } finally {
      copied = true;
      setTimeout(() => {
        pastingStatus = PastingStatus.ReadyToReset;
      }, ~~'0721');
    }
  };

  const reset = () => {
    code = '';
    selectedLang = '__auto__';
    guessedLang = '';
    selectedTTL = userPieceConfig.ttl || pieceConfig.ttlOptions[0].value;
    pastingStatus = PastingStatus.Pending;
    promptMessage = '';
    errorMessage = '';
    result = undefined;
    copied = false;
    textareaRef.value = '';
    textareaRef.focus();
  };

  onMount(async () => {
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
      }
    }, 0);
    hljs = await getHighlightJS().then((hljs) => {
      hljsReady = true;
      guessLang();
      return hljs;
    });
  });
</script>

<div class="flex flex-col items-center justify-center px-4 pt-16 md:pt-24 xl:pt-32 pb-16">
  <form class="flex flex-col items-center justify-center w-full md:w-3/4 lg:w-1/2 2xl:w-1/3">
    <label class="form-control w-full">
      <textarea
        class="textarea textarea-bordered {code.length > pieceConfig.maxCodeLength ? 'textarea-error' : ''}"
        rows="8"
        placeholder="Input your code here"
        on:input={handleCodeChange}
        bind:this={textareaRef}
      ></textarea>
      <div class="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt {code.length > pieceConfig.maxCodeLength ? 'text-error' : ''}"
          >{code.length} / {pieceConfig.maxCodeLength}</span
        >
      </div>
    </label>
    <div class="flex w-full justify-between mt-2">
      <label class="form-control w-full mr-1">
        <div class="label">
          <span class="label-text">Language</span>
        </div>
        <select class="select select-bordered pe-0" on:change={handleLangChange}>
          <option value="__auto__" selected>{guessedLang ? `Auto (${formatLang(guessedLang)})` : 'Auto Detect'}</option>
          {#each supportedLanguages as lang}
            <option value={lang.id} selected={selectedLang === lang.id}>{lang.label}</option>
          {/each}
        </select>
      </label>
      <label class="form-control w-full ml-1">
        <div class="label">
          <span class="label-text">Time to live</span>
        </div>
        <select class="select select-bordered pe-0" on:change={handleTTLChange}>
          {#each pieceConfig.ttlOptions as ttlOption}
            <option value={ttlOption.value} selected={selectedTTL === ttlOption.value}>{ttlOption.label}</option>
          {/each}
        </select>
      </label>
    </div>
    {#if relLinks.length > 0}
      <div class="flex w-full mt-2">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Relative Links</span>
          </div>
          <ul class="text-sm text-gray-500 ps-3">
            {#each relLinks as relLink}
              <li>{relLink}</li>
            {/each}
          </ul>
        </label>
      </div>
    {/if}
    <div class="mt-8 w-full select-none">
      {#if pastingStatus === PastingStatus.Pending || pastingStatus === PastingStatus.Error}
        <button class="btn btn-primary btn-block" class:btn-disabled={!validated} on:click={submit}>Paste!</button>
      {:else if pastingStatus === PastingStatus.Loading}
        <button class="btn btn-primary btn-block no-animation opacity-65">
          <span class="loading loading-spinner"></span> Pasting
        </button>
      {:else if pastingStatus === PastingStatus.Success}
        <button class="btn btn-success btn-block" on:click={copyURL}>Copy URL!</button>
      {:else if pastingStatus === PastingStatus.Copied}
        <button class="btn btn-success btn-block no-animation">Copied!</button>
      {/if}
      {#if pastingStatus === PastingStatus.ReadyToReset}
        <button class="btn btn-neutral btn-block" on:click={reset}>Reset and paste another!</button>
      {/if}
      {#if promptMessage}
        <div class="text-accent mt-2 select-text">{promptMessage}</div>
      {/if}
      {#if errorMessage}
        <div class="text-error mt-2 select-text">{errorMessage}</div>
      {/if}
      {#if result}
        <div role="alert" class="alert mt-3 border-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            >Your new piece: <a href={`/s/${result.key}`} class="link link-primary select-text"
              >{location.origin}/s/<code>{result.key}</code></a
            ></span
          >
        </div>
      {/if}
    </div>
  </form>
</div>
