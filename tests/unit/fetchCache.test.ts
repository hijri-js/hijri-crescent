import { describe, it, expect } from 'vitest';
import { isFresh } from '../../src/lib/fetchCache.js';

describe('isFresh', () => {
  it('returns true for very recent timestamps', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(isFresh(oneHourAgo)).toBe(true);
  });

  it('returns true at the boundary (35 hours ago)', () => {
    const thirtyFiveHoursAgo = new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString();
    expect(isFresh(thirtyFiveHoursAgo)).toBe(true);
  });

  it('returns false just beyond the 36-hour boundary', () => {
    const thirtySevenHoursAgo = new Date(Date.now() - 37 * 60 * 60 * 1000).toISOString();
    expect(isFresh(thirtySevenHoursAgo)).toBe(false);
  });

  it('returns false for very old timestamps', () => {
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
    expect(isFresh(threeDaysAgo)).toBe(false);
  });

  it('returns true for current timestamp', () => {
    expect(isFresh(new Date().toISOString())).toBe(true);
  });
});
