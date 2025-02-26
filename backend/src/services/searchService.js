require("dotenv").config();
const axios = require("axios");
const { generateEmbedding } = require("./embeddingService");
const { initVectorDB, addToVectorDB, searchVectorDB } = require("../utils/vectorDB");

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

initVectorDB();

const fetchSearchResults = async (query) => {
    try {
        const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CSE_ID}`;
        const response = await axios.get(googleSearchApiUrl);
        const results = response.data.items.map((item) => ({
            id: item.link,
            title: item.title,
            link: item.link,
            snippet: item.snippet,
        }));

        for (const result of results) {
            const text = `${result.title} ${result.snippet}`;
            const embedding = await generateEmbedding(text);
            if (embedding) {
                addToVectorDB(result.id, embedding, result);
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

const fetchRankedResults = async (query) => {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) return [];

    return searchVectorDB(queryEmbedding);
};

module.exports = { fetchSearchResults, fetchRankedResults };
