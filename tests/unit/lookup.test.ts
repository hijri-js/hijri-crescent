import { describe, it, expect } from 'vitest';
import { resolveCountryCode, getSupportedCountries } from '../../src/lib/lookup.js';

describe('resolveCountryCode', () => {
  it('resolves full country name', () => {
    expect(resolveCountryCode('Egypt')).toBe('EG');
    expect(resolveCountryCode('Saudi Arabia')).toBe('SA');
    expect(resolveCountryCode('United Arab Emirates')).toBe('AE');
    expect(resolveCountryCode('Kuwait')).toBe('KW');
    expect(resolveCountryCode('Jordan')).toBe('JO');
  });

  it('is case-insensitive for full names', () => {
    expect(resolveCountryCode('egypt')).toBe('EG');
    expect(resolveCountryCode('EGYPT')).toBe('EG');
    expect(resolveCountryCode('united arab emirates')).toBe('AE');
    expect(resolveCountryCode('SAUDI ARABIA')).toBe('SA');
  });

  it('resolves ISO codes directly', () => {
    expect(resolveCountryCode('EG')).toBe('EG');
    expect(resolveCountryCode('SA')).toBe('SA');
    expect(resolveCountryCode('AE')).toBe('AE');
    expect(resolveCountryCode('KW')).toBe('KW');
    expect(resolveCountryCode('JO')).toBe('JO');
  });

  it('is case-insensitive for ISO codes', () => {
    expect(resolveCountryCode('eg')).toBe('EG');
    expect(resolveCountryCode('sa')).toBe('SA');
    expect(resolveCountryCode('ae')).toBe('AE');
  });

  it('returns null for unsupported countries', () => {
    expect(resolveCountryCode('France')).toBeNull();
    expect(resolveCountryCode('UAE')).toBeNull();
    expect(resolveCountryCode('US')).toBeNull();
    expect(resolveCountryCode('Morocco')).toBeNull();
    expect(resolveCountryCode('Algeria')).toBeNull(); // temporarily disabled
    expect(resolveCountryCode('DZ')).toBeNull(); // temporarily disabled
  });

  it('returns null for empty input', () => {
    expect(resolveCountryCode('')).toBeNull();
    expect(resolveCountryCode('   ')).toBeNull();
  });

  it('trims whitespace', () => {
    expect(resolveCountryCode('  Egypt  ')).toBe('EG');
    expect(resolveCountryCode('  EG  ')).toBe('EG');
  });
});

describe('getSupportedCountries', () => {
  it('returns 5 active countries (Algeria temporarily disabled)', () => {
    const countries = getSupportedCountries();
    expect(countries).toHaveLength(5);
  });

  it('includes correct codes', () => {
    const codes = getSupportedCountries().map(c => c.code);
    expect(codes).toContain('EG');
    expect(codes).toContain('SA');
    expect(codes).toContain('AE');
    expect(codes).toContain('KW');
    expect(codes).toContain('JO');
    expect(codes).not.toContain('DZ');
  });
});
