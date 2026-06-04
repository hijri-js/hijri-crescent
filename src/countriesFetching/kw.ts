import * as cheerio from "cheerio";
import { websites } from "../data/websites";
import { fetchDateFromWebsite } from "../helpers/helpers";

export async function getHijriDateKuwait() {
  function onSuccess($: cheerio.CheerioAPI) {
    const hijraDateFromPage = $("#divTodayDate2").first().text();
    const [date, ...rest] = hijraDateFromPage?.split(" ");
    const year = rest.pop();
    const month = rest.join(" ");
    return { date, month, year };
  }

  try {
    return await fetchDateFromWebsite({
      url: websites.KW,
      onSuccess,
      onFailure: (error: unknown) => {
        throw new Error(`Something went wrong, \n${error}`);
      },
    });
  } catch (error: unknown) {
    throw new Error(`Something went wrong, \n${error}`);
  }
}
