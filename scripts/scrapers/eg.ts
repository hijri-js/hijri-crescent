import { fetchDateFromWebsite } from '../helpers/fetchWithCheerio.js';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateEgypt(): Promise<HijriDateData> {
  return fetchDateFromWebsite({
    url: websites.EG,
    onSuccess: ($) => {
      const text = $('.he-text').first().find('span').text().trim();
      const parts = text.split(/\s+/);
      const date = parts[0];
      const year = parts[parts.length - 1];
      const month = parts.slice(1, -1).join(' ');
      if (!date || !month || !year) throw new Error(`Unexpected format from EG: ${JSON.stringify(text)}`);
      return { date, month, year };
    },
    onFailure: (error) => { throw new Error(`EG scraper failed: ${error}`); },
  });
}
