import type { HijriDateResult, CountryInput } from './types.js';
import { resolveCountryCode, getSupportedCountries } from './lib/lookup.js';
import { fetchCache, isFresh } from './lib/fetchCache.js';

/**
 * Returns the officially moon-sighted Hijri date for a supported Arab country.
 *
 * Data is scraped 3x per day from official government and Islamic authority websites
 * and cached in this repo. Your app reads from the cache, no scraping on your end.
 *
 * @param country - Country name or 2-letter code, case-insensitive.
 *
 * @example
 * const result = await getHijriDateByCountry({ country: 'Egypt' });
 * if (result.success) {
 *   console.log(result.data.date, result.data.month, result.data.year);
 * } else {
 *   console.error(result.code, result.error);
 * }
 */
export async function getHijriDateByCountry({
  country,
}: {
  country: CountryInput;
}): Promise<HijriDateResult> {
  const code = resolveCountryCode(country);

  if (!code) {
    const supported = getSupportedCountries()
      .map(c => `${c.name} (${c.code})`)
      .join(', ');
    return {
      success: false,
      country,
      error: `Country "${country}" is not supported. Supported countries: ${supported}`,
      code: 'COUNTRY_NOT_SUPPORTED',
    };
  }

  let cache;
  try {
    cache = await fetchCache();
  } catch (err) {
    return {
      success: false,
      country,
      error: `Failed to fetch Hijri date cache: ${err instanceof Error ? err.message : String(err)}`,
      code: 'FETCH_FAILED',
    };
  }

  const entry = cache[code];

  if (!entry) {
    return {
      success: false,
      country,
      error: `No cached data found for ${country} (${code}). The scraper may not have run yet.`,
      code: 'FETCH_FAILED',
    };
  }

  if (!isFresh(entry.cachedAt)) {
    return {
      success: false,
      country,
      error: `Cached data for ${country} is stale (older than 36 hours). Check the status page for scraper health.`,
      code: 'FETCH_FAILED',
    };
  }

  if (entry.status === 'error') {
    return {
      success: false,
      country,
      error: entry.error ?? 'The scraper failed to extract the date from the official website.',
      code: 'PARSE_FAILED',
    };
  }

  if (!entry.data) {
    return {
      success: false,
      country,
      error: 'Cache entry is malformed (success status but no data).',
      code: 'PARSE_FAILED',
    };
  }

  return {
    success: true,
    country,
    data: entry.data,
    cachedAt: entry.cachedAt,
    source: entry.source,
  };
}

export type { HijriDateResult, HijriDateData, CountryCode, CountryInput } from './types.js';
