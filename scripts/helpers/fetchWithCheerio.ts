import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import type { HijriDateData } from '../../src/types.js';

type OnSuccess = ($: cheerio.CheerioAPI) => HijriDateData;
type OnFailure = (error: unknown) => never;

interface FetchOptions {
  url: string;
  onSuccess: OnSuccess;
  onFailure: OnFailure;
  getConfigs?: object;
}

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

export async function fetchDateFromWebsite({ url, onSuccess, onFailure, getConfigs }: FetchOptions): Promise<HijriDateData> {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: DEFAULT_HEADERS,
      ...getConfigs,
    });
    const $ = cheerio.load(response.data);
    return onSuccess($);
  } catch (error: unknown) {
    return onFailure(error);
  }
}

export function getHTTPAgentAcceptUnAuthorized(): https.Agent {
  return new https.Agent({ rejectUnauthorized: false });
}
