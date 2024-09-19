import { apiConfig } from '$lib/configs/api';
import type { Piece } from '$lib/interfaces/piece';
import { formatAPIResponse } from '$lib/utils/api';

export function addPiece(
  data: { code: string; lang: string; ttl: number },
  options: RequestInit = {},
): Promise<{ key: string }> {
  return fetch(`${apiConfig.logic.baseURL}/addPiece`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then((res) => res.json())
    .then((res) => formatAPIResponse(res));
}

export function getPiece(key: string, options: RequestInit = {}): Promise<Piece> {
  return fetch(`${apiConfig.pieceDist.baseURL}${key}.json`, {
    method: 'GET',
    ...options,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else if (res.status >= 404) {
      throw new Error('404 ~ Piece not found');
    }
    throw new Error(`Failed to get: HTTP ${res.status}`);
  });
}
