const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "google-credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const SPREADSHEET_ID = "1YbXcW3bbzdG7of8NSg6ITzez_f6n_xCzOSixCImDFZ4";

const addLeadToSheet = async (leadData) => {
  try {

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,

      range: "Sheet1!A:E",

      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [[
          leadData.name,
          leadData.email,
          leadData.company,
          new Date().toLocaleString(),
          leadData.status,
        ]],
      },
    });

    console.log("Lead added to Google Sheets");

  } catch (error) {
    console.error("Google Sheets Error:", error.message);
  }
};

module.exports = addLeadToSheet;