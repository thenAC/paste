import { apiConfig } from '$lib/configs/api';
import { formatAPIResponse } from '$lib/utils/api';

export function getStatistics(options: RequestInit = {}): Promise<{ totalCount: string; totalBytes: string }> {
  return fetch(`${apiConfig.logic.baseURL}/getStatistics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then((res) => res.json())
    .then((res) => formatAPIResponse(res));
}
