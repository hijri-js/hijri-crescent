export type CountryCode = 'EG' | 'SA' | 'AE' | 'KW' | 'JO' | 'DZ';

type CountryName = 'Egypt' | 'Saudi Arabia' | 'United Arab Emirates' | 'Kuwait' | 'Jordan';
type CountryISOCode = 'EG' | 'SA' | 'AE' | 'KW' | 'JO';

// string & {} keeps the named suggestions visible in IDE autocomplete
// while still accepting any string at runtime (runtime validation handles the rest)
export type CountryInput = CountryName | CountryISOCode | (string & {});

export interface HijriDateData {
  date: string;
  month: string;
  year: string;
}

export type HijriDateResult =
  | {
      success: true;
      country: string;
      data: HijriDateData;
      cachedAt: string;
      source: string;
    }
  | {
      success: false;
      country: string;
      error: string;
      code: 'COUNTRY_NOT_SUPPORTED' | 'FETCH_FAILED' | 'PARSE_FAILED';
    };

export interface CacheEntry {
  status: 'success' | 'error';
  data?: HijriDateData;
  cachedAt: string;
  source: string;
  error?: string;
}

export interface HijriCache {
  [code: string]: CacheEntry;
}
