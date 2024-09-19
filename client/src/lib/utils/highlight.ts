import type { HLJSApi } from 'highlight.js';
import { supportedLanguages } from '$lib/configs/language';

let hljs: HLJSApi;

export type HLJS = HLJSApi;

export async function getHighlightJS() {
  if (hljs) {
    return hljs;
  }
  const { default: hljsNew } = await import('highlight.js/lib/core');

  const tasks: Promise<void>[] = [];
  for (const lang of supportedLanguages) {
    tasks.push(
      (async () => {
        const { default: languageModule } = await lang.hljsModule();
        if (languageModule) {
          hljsNew.registerLanguage(lang.id, languageModule);
        }
      })(),
    );
  }
  await Promise.all(tasks);
  hljs = hljsNew;
  // @ts-ignore
  window.hljs = hljs;
  return hljs;
}
