const express = require("express");
const { fetchSearchResults, fetchGeminiSummary } = require("../services/searchService");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  } 

  const sources = await fetchSearchResults(query);
  const summary = await fetchGeminiSummary(query, sources);

  res.json({ summary, sources });
});

module.exports = router;