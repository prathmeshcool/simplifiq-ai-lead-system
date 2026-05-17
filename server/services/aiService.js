const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAudit = async (companyData) => {
  try {
    const prompt = `
    You are an AI business consultant.

    Analyze the company website data and return ONLY valid JSON in this exact structure:

    {
    "companySummary": "",
    "painPoints": [],
    "aiOpportunities": [],
    "recommendations": []
    }

    Company Website Data:
    ${companyData}
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let content = response.choices[0].message.content;

    console.log(content);

    content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    return JSON.parse(content);

  } catch (error) {
    console.error("Groq Error:", error.message);

    return {
    companySummary: "AI analysis failed",
    painPoints: [],
    aiOpportunities: [],
    recommendations: [],
    };
  }
};

module.exports = generateAudit;