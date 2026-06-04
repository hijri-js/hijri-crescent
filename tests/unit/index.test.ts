import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { HijriCache } from '../../src/types.js';

const FRESH_TIMESTAMP = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const STALE_TIMESTAMP = new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString();

function mockFetch(cache: HijriCache) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(cache),
  }));
}

function mockFetchFailure(status = 500) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    status,
  }));
}

function mockNetworkError() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
}

describe('getHijriDateByCountry', () => {
  let getHijriDateByCountry: typeof import('../../src/index.js').getHijriDateByCountry;

  beforeEach(async () => {
    vi.resetModules();
    ({ getHijriDateByCountry } = await import('../../src/index.js'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns COUNTRY_NOT_SUPPORTED for unknown country', async () => {
    const result = await getHijriDateByCountry({ country: 'France' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('COUNTRY_NOT_SUPPORTED');
      expect(result.country).toBe('France');
      expect(result.error).toContain('France');
    }
  });

  it('returns COUNTRY_NOT_SUPPORTED for empty string', async () => {
    const result = await getHijriDateByCountry({ country: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('COUNTRY_NOT_SUPPORTED');
    }
  });

  it('returns FETCH_FAILED when network throws', async () => {
    mockNetworkError();
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('FETCH_FAILED');
      expect(result.error).toContain('Network error');
    }
  });

  it('returns FETCH_FAILED when HTTP response is not ok', async () => {
    mockFetchFailure(503);
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('FETCH_FAILED');
      expect(result.error).toContain('503');
    }
  });

  it('returns FETCH_FAILED when country is missing from cache', async () => {
    mockFetch({});
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('FETCH_FAILED');
    }
  });

  it('returns FETCH_FAILED when cached data is stale', async () => {
    mockFetch({
      EG: {
        status: 'success',
        data: { date: '1', month: 'Muharram', year: '1447' },
        cachedAt: STALE_TIMESTAMP,
        source: 'https://example.com',
      },
    });
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('FETCH_FAILED');
      expect(result.error).toContain('stale');
    }
  });

  it('returns PARSE_FAILED when scraper recorded an error', async () => {
    mockFetch({
      EG: {
        status: 'error',
        error: 'Selector .he-text returned empty',
        cachedAt: FRESH_TIMESTAMP,
        source: 'https://www.dar-alifta.org/en',
      },
    });
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('PARSE_FAILED');
      expect(result.error).toContain('Selector');
    }
  });

  it('returns success with date data for valid cached entry', async () => {
    const entry = {
      status: 'success' as const,
      data: { date: '18', month: 'Dhu-al-Hijjah', year: '1447' },
      cachedAt: FRESH_TIMESTAMP,
      source: 'https://www.dar-alifta.org/en',
    };
    mockFetch({ EG: entry });
    const result = await getHijriDateByCountry({ country: 'Egypt' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.country).toBe('Egypt');
      expect(result.data.date).toBe('18');
      expect(result.data.month).toBe('Dhu-al-Hijjah');
      expect(result.data.year).toBe('1447');
      expect(result.cachedAt).toBe(FRESH_TIMESTAMP);
      expect(result.source).toBe('https://www.dar-alifta.org/en');
    }
  });

  it('resolves by ISO code', async () => {
    mockFetch({
      EG: {
        status: 'success',
        data: { date: '18', month: 'Dhu-al-Hijjah', year: '1447' },
        cachedAt: FRESH_TIMESTAMP,
        source: 'https://www.dar-alifta.org/en',
      },
    });
    const result = await getHijriDateByCountry({ country: 'EG' });
    expect(result.success).toBe(true);
  });

  it('resolves case-insensitively', async () => {
    mockFetch({
      EG: {
        status: 'success',
        data: { date: '18', month: 'Dhu-al-Hijjah', year: '1447' },
        cachedAt: FRESH_TIMESTAMP,
        source: 'https://www.dar-alifta.org/en',
      },
    });
    const result = await getHijriDateByCountry({ country: 'egypt' });
    expect(result.success).toBe(true);
  });
});
