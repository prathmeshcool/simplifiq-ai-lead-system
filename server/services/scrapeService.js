const axios = require("axios");
const cheerio = require("cheerio");

const scrapeWebsite = async (url) => {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    $("script").remove();
    $("style").remove();

    const text = $("body").text();

    return text
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

  } catch (error) {
    console.error("Scraping Error:", error.message);

    return "Unable to scrape website content";
  }
};

module.exports = scrapeWebsite;