import { chromium } from 'playwright';
import { websites } from '../websites.js';
import type { HijriDateData } from '../../src/types.js';

export async function getHijriDateJordan(): Promise<HijriDateData> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    // Arabic version has the Hijri date in #lblCurrentTime; English version does not
    await page.goto(websites.JO, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#lblCurrentTime', { timeout: 15000 });

    const text = await page.locator('#lblCurrentTime').first().innerText();
    if (!text.trim()) throw new Error('Hijri date span is empty on aliftaa.jo');

    // Format: "18 ذو الحجة 1447  ,  04 حزيران 2026"
    const hijriPart = text.split(',')[0].trim();
    const parts = hijriPart.split(/\s+/).filter(Boolean);
    if (parts.length < 3) throw new Error(`Unexpected format from JO: ${JSON.stringify(text)}`);

    const date = parts[0];
    const year = parts[parts.length - 1];
    const month = parts.slice(1, -1).join(' ');

    return { date, month, year };
  } finally {
    await browser.close();
  }
}
