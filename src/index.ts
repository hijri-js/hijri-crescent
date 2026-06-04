import {
  countriesCodes,
  countriesFunctionsMapping,
  countryKey,
} from "./data/countries";
import { capitalizeString } from "./utils/utils";
import jsdom from "jsdom";

async function getHijriDateByCountry({ country }: { country: string }) {
  const countryCapitalized = capitalizeString(country);

  // const { JSDOM } = jsdom;

  // // Load the HTML document
  // const url = "https://www.dar-alifta.org/en";
  // const dom = await JSDOM.fromURL(url);
  // // Extract data from the document
  // const hijraDateFromPage =
  //   dom.window.document.querySelector(".he-text").textContent;
  // const [date, month, year] = hijraDateFromPage?.split('"')[1].split(" ");
  // console.log({ date, month, year });
  // return { date, month, year };

  //////////////////////
  if (countriesCodes[countryCapitalized]) {
    // check if country we have it
    // TODO:

    const code = countriesCodes[countryCapitalized];
    const { date, month, year } = await countriesFunctionsMapping[
      code as countryKey
    ]();
    // process.env.NODE_ENV === "development" &&
    console.log({ date, month, year });
    return { date, month, year };
  } else {
    return `We currently don't support ${country}'s hijri date, Please enter a valid country name`;
  }
}

getHijriDateByCountry({ country: "United Arab Emirates" });

export { getHijriDateByCountry };
