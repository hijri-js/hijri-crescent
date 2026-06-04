import { chromium } from 'playwright';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

// The carousel on awqaf.gov.ae shows the Hijri date as: "18 ZelHaj 1447"
// We try both English (via innerText) and Arabic (via textContent) patterns
const ARABIC_PATTERN = /(\d{1,2})\s+([؀-ۿ][؀-ۿ\s]+?)\s+(\d{4})/;
const ENGLISH_PATTERN = /(\d{1,2})\s+([A-Za-z]{3,})\s+(14\d{2})/;

async function tryLoadPage(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(10000); // carousel needs time to initialize
    return await page.locator('body').innerText();
  } finally {
    await browser.close();
  }
}

export async function getHijriDateEmirates(): Promise<HijriDateData> {
  // Retry once if the first attempt doesn't find the date (carousel timing)
  for (let attempt = 1; attempt <= 2; attempt++) {
    const text = await tryLoadPage(websites.AE);

    const matchEn = text.match(ENGLISH_PATTERN);
    if (matchEn) {
      const [, date, month, year] = matchEn;
      return { date: date.trim(), month: month.trim(), year: year.trim() };
    }

    const matchAr = text.match(ARABIC_PATTERN);
    if (matchAr) {
      const [, date, month, year] = matchAr;
      return { date: date.trim(), month: month.trim(), year: year.trim() };
    }

    if (attempt === 2) {
      throw new Error(`No Hijri date found on awqaf.gov.ae after 2 attempts. Sample: ${JSON.stringify(text.slice(0, 300))}`);
    }
  }

  throw new Error('Unreachable');
}
