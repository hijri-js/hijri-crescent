import { fetchDateFromWebsite } from '../helpers/fetchWithCheerio.js';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateEgypt(): Promise<HijriDateData> {
  return fetchDateFromWebsite({
    url: websites.EG,
    onSuccess: ($) => {
      const text = $('.he-text').first().text();
      const [date, month, year] = text.split('"')[1].split(' ');
      if (!date || !month || !year) throw new Error(`Unexpected format from EG: ${JSON.stringify(text)}`);
      return { date: date.trim(), month: month.trim(), year: year.trim() };
    },
    onFailure: (error) => { throw new Error(`EG scraper failed: ${error}`); },
  });
}
