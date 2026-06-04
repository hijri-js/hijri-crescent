import * as cheerio from "cheerio";
import { websites } from "../data/websites";
import {
  fetchDateFromWebsite,
  getHTTPAgentAcceptUnAuthorized,
} from "../helpers/helpers";

export async function getHijriDateSaudiArabia() {
  function onSuccess($: cheerio.CheerioAPI) {
    const date = $("#ContentPlaceHolder1_homepage1_lblHDay").text();
    const month = $("#ContentPlaceHolder1_homepage1_lblHMonthE").text();
    const year = $("#ContentPlaceHolder1_homepage1_lblHYear").text();
    return { date, month, year };
  }

  try {
    const agent = getHTTPAgentAcceptUnAuthorized();

    return await fetchDateFromWebsite({
      url: websites.SA,
      onSuccess,
      onFailure: (error: unknown) => {
        throw new Error(`Something went wrong, \n${error}`);
      },
      getConfigs: { httpsAgent: agent },
    });
  } catch (error: unknown) {
    throw new Error(`Something went wrong, \n${error}`);
  }
}
