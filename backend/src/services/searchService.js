require("dotenv").config();
const axios = require("axios");

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const fetchSearchResults = async (query) => {
  const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CSE_ID}`;

  try {
    const response = await axios.get(googleSearchApiUrl);
    return response.data.items.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

const fetchGeminiSummary = async (query, sources) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Summarize the following search query: "${query}" based on these sources: ${sources.map((s) => s.title).join(", ")}`;

  try {
    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    return "Summary could not be generated";
  }
};

module.exports = { fetchSearchResults, fetchGeminiSummary };
