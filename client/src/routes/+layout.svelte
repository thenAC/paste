<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
  import { filesize } from 'filesize';
  import '../app.css';
  import logo from '$lib/assets/logo.svg';
  import avatar_bLue from '$lib/assets/avatar-bLue-sm.png';
  import { getStatistics } from '$lib/api/statistics';

  let statistics: { totalCount: string; totalBytes: string } | undefined;

  const fetchStatistics = async () => {
    try {
      statistics = await getStatistics();
    } catch (e: any) {
      console.error('Failed to fetch statistics:', e);
    }
  };

  onMount(async () => {
    fetchStatistics();
  });
</script>

<header>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a
        class="btn btn-ghost hover:bg-transparent text-xl border-0 border-b-2 border-slate-600 rounded-none px-1 ml-3 tooltip tooltip-bottom"
        data-tip="Paste then AC"
        href="/"><img alt="logo" src={logo} class="h-8" /></a
      >
    </div>
    <div class="flex-none">
      <div class="hidden md:block">
        <a role="button" class="btn btn-ghost" href="https://github.com/thenAC" target="_blank">GitHub</a>
        <a role="button" class="btn btn-ghost" href="https://docs.of.paste.then.ac" target="_blank">文档</a>
      </div>
      <div class="md:hidden">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabindex="-1" class="menu dropdown-content bg-base-200 rounded-box z-[1] mt-2 w-24 p-2 shadow">
            <li><a href="https://github.com/thenAC" target="_blank">GitHub</a></li>
            <li><a href="https://docs.of.paste.then.ac" target="_blank">文档</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</header>

<main class="content">
  <slot />
</main>

<footer class="footer footer-center bg-base-300 text-base-content p-4 select-none">
  <aside>
    <div class="flex items-center">
      <span class="ml-1">
        {#if statistics}
          <span  class="mr-2">Total pieces: {statistics.totalCount}</span>·<span class="ml-2">Total size: {filesize(statistics.totalBytes)}</span>
        {:else}
          <span>·</span>
        {/if}
      </span>
    </div>
    <div class="flex items-center">
      © {new Date().getFullYear()} · Developed by
      <a
        role="button"
        class="btn btn-sm btn-ghost px-0.5 mx-0.5"
        href="https://dreamer.blue"
        target="_blank"
        title="bLue"
      >
        <img src={avatar_bLue} alt="avatar of bLue" class="inline-block rounded-full w-6" />
        bLue</a
      > with ❤️
    </div>
  </aside>
</footer>

<GoogleAnalytics properties={['G-SWVEWB390N']}></GoogleAnalytics>
