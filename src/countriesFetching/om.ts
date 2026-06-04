import * as cheerio from "cheerio";
import { websites } from "../data/websites";
import {
  fetchDateFromWebsite,
  getHTTPAgentAcceptUnAuthorized,
} from "../helpers/helpers";

export async function getHijriDateOman() {
  // function onSuccess($: cheerio.CheerioAPI) {
  //   const hijraDateFromPage = $("#hijridatediv").first().text();
  //   console.log("hijraDateFromPage", hijraDateFromPage);
  //   const [date, month, year] = hijraDateFromPage?.trim().split(" ");
  //   return { date, month, year };
  // }
  // try {
  //   const agent = getHTTPAgentAcceptUnAuthorized();
  //   return await fetchDateFromWebsite({
  //     url: websites.OM,
  //     onSuccess,
  //     onFailure: (error: unknown) => {
  //       throw new Error(`Something went wrong, \n${error}`);
  //     },
  //     getConfigs: { httpsAgent: agent },
  //   });
  // } catch (error: unknown) {
  //   throw new Error(`Something went wrong, \n${error}`);
  // }
}
