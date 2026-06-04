import type { CountryCode } from '../types.js';

// Algeria (DZ) is temporarily disabled — marw.gov.dz blocks requests outside Algeria
const NAME_TO_CODE: Record<string, CountryCode> = {
  'Egypt': 'EG',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
  'Kuwait': 'KW',
  'Jordan': 'JO',
};

const VALID_CODES = new Set<CountryCode>(['EG', 'SA', 'AE', 'KW', 'JO']);

export function resolveCountryCode(input: string): CountryCode | null {
  if (!input || !input.trim()) return null;

  const trimmed = input.trim();

  const upperCode = trimmed.toUpperCase() as CountryCode;
  if (VALID_CODES.has(upperCode)) return upperCode;

  const lowerInput = trimmed.toLowerCase();
  for (const [name, code] of Object.entries(NAME_TO_CODE)) {
    if (name.toLowerCase() === lowerInput) return code;
  }

  return null;
}

export function getSupportedCountries(): Array<{ name: string; code: CountryCode }> {
  return Object.entries(NAME_TO_CODE).map(([name, code]) => ({ name, code }));
}
