import { chromium } from 'playwright';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateAlgeria(): Promise<HijriDateData> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(websites.DZ, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Try the known selector first
    const selectors = ['#ubiko-date-hijri', '[id*="hijri"]', '[class*="hijri"]', '[class*="date"]'];
    let text = '';

    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        text = await page.locator(selector).first().innerText();
        if (text.trim()) break;
      }
    }

    // Fallback: search body text for Hijri date pattern
    if (!text.trim()) {
      const bodyText = await page.locator('body').innerText();
      const match = bodyText.match(/(\d{1,2})\s+([؀-ۿ][؀-ۿ\s]+?)\s+(\d{4})/);
      if (match) {
        const [, date, month, year] = match;
        return { date: date.trim(), month: month.trim(), year: year.trim() };
      }
      throw new Error('No Hijri date found on marw.gov.dz');
    }

    // Expected Arabic format: "18 ذو الحجة 1447هـ"
    const match = text.match(/(\d+)\s+([؀-ۿ][؀-ۿ\s]+?)\s+(\d+)/);
    if (!match) throw new Error(`Unexpected format from DZ: ${JSON.stringify(text)}`);

    const [, date, month, year] = match;
    return { date: date.trim(), month: month.trim(), year: year.trim() };
  } finally {
    await browser.close();
  }
}
