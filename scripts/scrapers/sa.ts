import { fetchDateFromWebsite, getHTTPAgentAcceptUnAuthorized } from '../helpers/fetchWithCheerio.js';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateSaudiArabia(): Promise<HijriDateData> {
  const agent = getHTTPAgentAcceptUnAuthorized();
  return fetchDateFromWebsite({
    url: websites.SA,
    getConfigs: { httpsAgent: agent },
    onSuccess: ($) => {
      const date = $('#ContentPlaceHolder1_homepage1_lblHDay').text().trim();
      const month = $('#ContentPlaceHolder1_homepage1_lblHMonthE').text().trim();
      const year = $('#ContentPlaceHolder1_homepage1_lblHYear').text().trim();
      if (!date || !month || !year) throw new Error(`Unexpected format from SA: date=${date} month=${month} year=${year}`);
      return { date, month, year };
    },
    onFailure: (error) => { throw new Error(`SA scraper failed: ${error}`); },
  });
}
