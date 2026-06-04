import * as cheerio from "cheerio";
import { websites } from "../data/websites";
import { fetchDateFromWebsite } from "../helpers/helpers";

export async function getHijriDateAlgeria() {
  function onSuccess($: cheerio.CheerioAPI) {
    const hijraDateFromPage = $("#ubiko-date-hijri").first().text();
    const [, date, month, year] = hijraDateFromPage.match(
      /(\d+)\s+(.+)\s+(\d+)هـ/
    );
    return { date, month, year };
  }

  try {
    return await fetchDateFromWebsite({
      url: websites.DZ,
      onSuccess,
      onFailure: (error: unknown) => {
        throw new Error(`Something went wrong, \n${error}`);
      },
    });
  } catch (error: unknown) {
    throw new Error(`Something went wrong, \n${error}`);
  }
}
