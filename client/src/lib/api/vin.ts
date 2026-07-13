import { apiConfig } from '$lib/configs/api';

const VIN_PREFIX = 'VIN:';

function parseVinMessage(content: string): string | undefined {
  const trimmedContent = content.trim();
  if (!trimmedContent.startsWith(VIN_PREFIX)) {
    return undefined;
  }

  const message = trimmedContent.slice(VIN_PREFIX.length).trim();
  return message || undefined;
}

export async function getVinMessage(options: RequestInit = {}): Promise<string | undefined> {
  try {
    const response = await fetch(apiConfig.vin.url, {
      method: 'GET',
      ...options,
    });

    if (response.status >= 400) {
      if (response.status !== 404) {
        console.error(`Failed to fetch VIN: HTTP ${response.status}`);
      }
      return undefined;
    }

    return parseVinMessage(await response.text());
  } catch {
    return undefined;
  }
}
