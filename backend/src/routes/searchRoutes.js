const express = require("express");
const { fetchSearchResults, fetchRankedResults } = require("../services/searchService");

const router = express.Router();

router.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    await fetchSearchResults(query); // Fetch and store results
    const rankedResults = await fetchRankedResults(query);

    res.json({ results: rankedResults });
});

module.exports = router;
