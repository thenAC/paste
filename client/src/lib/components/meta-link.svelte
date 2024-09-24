<script lang="ts">
  import { getRelMeta } from '$lib/api/misc';
  import { supportedLanguages } from '$lib/configs/language';
  import type { IRelMeta } from '$lib/interfaces/misc';

  export let relLink: string = '';

  let loading = false;
  let data: IRelMeta | null = null;
  let error = '';
  let reqSeq = 0;

  $: {
    if (relLink) {
      const seq = ++reqSeq;
      loading = true;
      error = '';
      data = null;
      getRelMeta([relLink])
        .then((res) => {
          if (seq === reqSeq) {
            data = res.relMetaList[0];
          }
        })
        .catch((e) => {
          if (seq === reqSeq) {
            console.error('[meta-link] Failed to fetch:', e);
            error = 'Failed to fetch';
          }
        })
        .finally(() => {
          if (seq === reqSeq) {
            loading = false;
          }
        });
    }
  }

  const getLangLabel = (lang: string | undefined) => {
    const l = supportedLanguages.find((l) => l.id === lang);
    return l?.label || lang || '--';
  };

  const getSolutionResultClass = (result: string | undefined) => {
    switch (result) {
      case 'AC':
        return 'solution-ac';
      case 'FB':
        return 'solution-fb';
      case '?':
        return 'solution-fz';
      default:
        return 'solution-rj';
    }
  };
</script>

{#if loading}
  <a role="button" class="btn btn-ghost btn-sm" title="Loading">
    <span class="loading loading-dots loading-sm"></span>
  </a>
{:else if error || !data}
  <a role="button" class="btn btn-ghost btn-sm text-sm" href={relLink} target="_blank" rel="noopener noreferrer"
    >{relLink}</a
  >
{:else}
  <a
    role="button"
    class="btn btn-ghost btn-sm text-sm font-light"
    href={relLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    {#if data.icon}
      <img src={data.icon} alt="icon" class="inline-block rounded-full w-4" />
    {/if}
    {#if data.platform}
      <span class="font-bold text-gray-400">{data.platform.label}<span class="font-light pl-2">/</span></span>
    {/if}
    {#if data.solution}
      <span
        >{data.solution.id} -
        <span
          class={`border-1 border-transparent rounded font-semibold px-2 py-1 mr-2 ${getSolutionResultClass(data.solution.result)}`}
          >{data.solution.result}</span
        >{getLangLabel(data.solution.language)}
      </span>
    {:else if data.contest}
      <span class="font-light">{data.contest.id} - {data.contest.title}</span>
    {:else if data.problem}
      <span class="font-light">{data.problem.id} - {data.problem.title}</span>
    {/if}
  </a>
{/if}

<style lang="less">
  .solution-ac {
    background-color: #084b00;
  }

  .solution-fb {
    background-color: #248e18;
  }

  .solution-fz {
    background-color: #2f4a8e;
  }

  .solution-rj {
    background-color: #690700;
  }
</style>
