<script lang="ts">
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import { page } from '$app/stores';
  import { getPiece } from '$lib/api/piece';
  import type { Piece } from '$lib/interfaces/piece';
  import { supportedLanguages } from '$lib/configs/language';
  import { getHighlightJS, type HLJS } from '$lib/utils/highlight';
  import 'highlight.js/styles/github-dark.css';

  let key = $page.params.key;
  let isLoading = false;
  let data: Piece | undefined;
  let hljs: HLJS;
  let hljsReady = false;
  let codeblocks: string[] = [];
  let errorMessage = '';
  let copied = false;

  $: displayLang = supportedLanguages.find((l) => l.id === data?.lang)?.label || data?.lang;

  const fetchData = async (key: string) => {
    try {
      isLoading = true;
      const res = await getPiece(key);
      if (typeof res === 'object' && 'key' in res) {
        data = res;
        return data;
      }
      throw new Error('Invalid response');
    } catch (e: any) {
      errorMessage = e.message;
    } finally {
      isLoading = false;
    }
  };

  const highlightCode = (code: string, language: string) => {
    const res = hljs.highlight(code, { language }).value;
    codeblocks = res.split('\n');
  };

  const copyCode = () => {
    if (copied) {
      return;
    }
    try {
      navigator.clipboard.writeText(data!.code);
    } catch (e) {
      errorMessage = 'Failed to copy code';
    } finally {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, ~~'0721');
    }
  };

  onMount(async () => {
    const [dataRes, hljsRes] = await Promise.all([
      fetchData(key),
      getHighlightJS().then((hljs) => {
        hljsReady = true;
        return hljs;
      }),
    ]);
    hljs = hljsRes;
    highlightCode(dataRes!.code, dataRes!.lang);
  });
</script>

<div class="flex flex-col items-center justify-center px-4 pt-16 md:pt-24 xl:pt-32 pb-16">
  <h2 class="select-none">Piece<span class="kbd kbd-sm ml-2 select-text">{key}</span></h2>
  {#if isLoading}
    <div class="loading loading-spinner loading-lg mt-4"></div>
  {/if}
  {#if data}
    <div class="mt-4 w-full flex flex-col items-center justify-center">
      <div class="text-sm opacity-65 select-none">
        Created at: {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss Z')}
      </div>
      <div class="text-sm opacity-65 select-none">
        Expires at: {data.expireAt ? dayjs(data.expireAt).format('YYYY-MM-DD HH:mm:ss Z') : 'Never'}
      </div>
      <div class="text-sm opacity-65 select-none">Language: {displayLang}</div>
      {#if !copied}
        <button class="btn btn-success mt-4" on:click={copyCode}>Copy!</button>
      {:else}
        <button class="btn btn-success mt-4 no-animation">Copied!</button>
      {/if}
      <div class="mockup-code mt-4 w-full lg:w-3/4 2xl:w-2/3 custom-code">
        <div class="flex flex-row">
          <div class="line-number">
            {#each codeblocks as line, i}
              <pre data-prefix={i + 1}><code></code></pre>
            {/each}
          </div>
          <div class="code-line">
            {#each codeblocks as line, i}
              <pre><code>{@html line}</code></pre>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if errorMessage}
    <div class="alert alert-error mt-4 w-full md:w-3/4 lg:w-1/2 2xl:w-1/3">{errorMessage}</div>
  {/if}
</div>

<style lang="less">
  .custom-code {
    overflow: hidden;

    .line-number {
      pre {
        padding-right: 1rem;
      }
    }

    .code-line {
      overflow: auto;
      margin-right: 1rem;

      pre::before {
        margin-right: 0;
      }
      pre {
        min-height: 1.5rem;
      }
    }
  }
</style>
