const puppeteer = require("puppeteer");
const path = require("path");

const generatePDF = async (html, company) => {

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(html);

  const filePath = path.join(
    __dirname,
    `../generated-reports/${company}-${Date.now()}.pdf`
  );

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};

module.exports = generatePDF;