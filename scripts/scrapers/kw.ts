import { fetchDateFromWebsite } from '../helpers/fetchWithCheerio.js';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateKuwait(): Promise<HijriDateData> {
  return fetchDateFromWebsite({
    url: websites.KW,
    onSuccess: ($) => {
      const text = $('#divTodayDate2').first().text().trim();
      const parts = text.split(' ').filter(Boolean);
      if (parts.length < 3) throw new Error(`Unexpected format from KW: ${JSON.stringify(text)}`);
      const date = parts[0];
      const year = parts[parts.length - 1];
      const month = parts.slice(1, -1).join(' ');
      return { date, month, year };
    },
    onFailure: (error) => { throw new Error(`KW scraper failed: ${error}`); },
  });
}
