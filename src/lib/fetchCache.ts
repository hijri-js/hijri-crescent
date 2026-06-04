import type { HijriCache } from '../types.js';

const CACHE_URL =
  'https://raw.githubusercontent.com/hijri-js/hijri-crescent/main/data/hijri-dates.json';

const FRESHNESS_WINDOW_MS = 36 * 60 * 60 * 1000; // 36 hours

export async function fetchCache(): Promise<HijriCache> {
  const response = await fetch(CACHE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Hijri date cache: HTTP ${response.status}`);
  }
  return response.json() as Promise<HijriCache>;
}

export function isFresh(cachedAt: string): boolean {
  const age = Date.now() - new Date(cachedAt).getTime();
  return age <= FRESHNESS_WINDOW_MS;
}
