import { apiConfig } from '$lib/configs/api';
import type { IRelMeta } from '$lib/interfaces/misc';
import { formatAPIResponse } from '$lib/utils/api';

export function getRelMeta(
  relLinks: string[],
  options: RequestInit = {},
): Promise<{ relMetaList: (IRelMeta | null)[] }> {
  return fetch(`${apiConfig.logic.baseURL}/getRelMeta?relLinks=${encodeURIComponent(relLinks.join(','))}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then((res) => res.json())
    .then((res) => formatAPIResponse(res));
}
