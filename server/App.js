const express = require("express");
const cors = require("cors");
require("dotenv").config();

const scrapeWebsite = require("./services/scrapeService");
const generateAudit = require("./services/aiService");
const generateHTMLReport = require("./templates/reportTemplate");
const generatePDF = require("./services/pdfService");
const sendEmail = require("./services/emailService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.post("/api/lead", async (req, res) => {
  try {
    const { name, email, company, website } = req.body;
    if (!name || !email || !company || !website) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    console.log("Lead received:", company);

    const scrapedContent = await scrapeWebsite(website);

    const audit = await generateAudit(scrapedContent);
    const htmlReport = generateHTMLReport(audit, company);
    const pdfPath = await generatePDF(htmlReport, company);
    const addLeadToSheet = require("./services/sheetsService");
    await sendEmail(email, company, pdfPath);
    

    await addLeadToSheet({
    name,
    email,
    company,
    status: "Success",
    });

    res.json({
      success: true,
      message: `Audit generated for ${company}`,
      audit,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});