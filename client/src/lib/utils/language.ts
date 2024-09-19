import { supportedLanguages } from '$lib/configs/language';

export function formatLang(lang: string) {
  return supportedLanguages.find((l) => l.id === lang)?.label || lang;
}
