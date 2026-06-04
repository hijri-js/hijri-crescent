import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getHijriDateEgypt } from './scrapers/eg.js';
import { getHijriDateSaudiArabia } from './scrapers/sa.js';
import { getHijriDateEmirates } from './scrapers/ae.js';
import { getHijriDateKuwait } from './scrapers/kw.js';
import { getHijriDateJordan } from './scrapers/jo.js';
// import { getHijriDateAlgeria } from './scrapers/dz.js'; // disabled: marw.gov.dz is geoblocked outside Algeria
import { websites } from './websites.js';
import type { HijriCache, CacheEntry } from '../src/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');

const SCRAPERS = [
  { code: 'EG', fn: getHijriDateEgypt, source: websites.EG },
  { code: 'SA', fn: getHijriDateSaudiArabia, source: websites.SA },
  { code: 'AE', fn: getHijriDateEmirates, source: websites.AE },
  { code: 'KW', fn: getHijriDateKuwait, source: websites.KW },
  { code: 'JO', fn: getHijriDateJordan, source: websites.JO },
  // { code: 'DZ', fn: getHijriDateAlgeria, source: websites.DZ }, // disabled: geoblocked outside Algeria
] as const;

async function run() {
  const runStartedAt = new Date().toISOString();
  console.log(`\n🌙 hijri-crescent scraper | ${runStartedAt}`);
  console.log('-'.repeat(50));

  const results = await Promise.allSettled(
    SCRAPERS.map(({ fn }) => fn())
  );

  const cache: HijriCache = {};
  const statusCountries: Record<string, unknown> = {};
  let successCount = 0;

  for (let i = 0; i < SCRAPERS.length; i++) {
    const { code, source } = SCRAPERS[i];
    const result = results[i];
    const cachedAt = new Date().toISOString();

    if (result.status === 'fulfilled') {
      const entry: CacheEntry = { status: 'success', data: result.value, cachedAt, source };
      cache[code] = entry;
      statusCountries[code] = { status: 'success', cachedAt };
      console.log(`  OK  ${code}: ${JSON.stringify(result.value)}`);
      successCount++;
    } else {
      const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
      const entry: CacheEntry = { status: 'error', error, cachedAt, source };
      cache[code] = entry;
      statusCountries[code] = { status: 'error', cachedAt, error };
      console.log(`  ERR ${code}: ${error}`);
    }
  }

  console.log('-'.repeat(50));
  console.log(`Result: ${successCount}/${SCRAPERS.length} scrapers succeeded`);

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(join(DATA_DIR, 'hijri-dates.json'), JSON.stringify(cache, null, 2));
  await writeFile(join(DATA_DIR, 'status.json'), JSON.stringify({
    lastRunAt: runStartedAt,
    countries: statusCountries,
  }, null, 2));

  console.log(`Written: data/hijri-dates.json, data/status.json\n`);

  if (successCount === 0) {
    console.error('All scrapers failed');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
