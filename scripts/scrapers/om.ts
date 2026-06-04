// Oman scraper — disabled (official source not yet determined)
// The old target https://www.mara.gov.om/home.aspx may have changed
// TODO: Find a working official Omani Hijri date source

// import { chromium } from 'playwright';
// import { websites } from '../websites.js';
// import type { HijriDateData } from '../../src/types.js';

// export async function getHijriDateOman(): Promise<HijriDateData> {
//   const browser = await chromium.launch({ headless: true });
//   try {
//     const page = await browser.newPage();
//     await page.goto(websites.OM, { waitUntil: 'networkidle', timeout: 30000 });
//     // TODO: identify correct selector on mara.gov.om
//     await browser.close();
//   } finally {
//     await browser.close();
//   }
// }
