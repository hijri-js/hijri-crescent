import * as cheerio from "cheerio";
import { websites } from "../data/websites";
import { fetchDateFromWebsite } from "../helpers/helpers";

export async function getHijriDateJordan() {
  function onSuccess($: cheerio.CheerioAPI) {
    const hijraDateFromPage = $("#Header1_lblCurrentTime").first().text();
    const [date, month, year] = hijraDateFromPage
      ?.split(",")[0]
      .trim()
      .split(" ");
    return { date, month, year };
  }

  try {
    return await fetchDateFromWebsite({
      url: websites.JO,
      onSuccess,
      onFailure: (error: unknown) => {
        throw new Error(`Something went wrong, \n${error}`);
      },
    });
  } catch (error: unknown) {
    throw new Error(`Something went wrong, \n${error}`);
  }
}
