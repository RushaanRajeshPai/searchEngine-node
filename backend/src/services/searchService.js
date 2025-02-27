require("dotenv").config();
const axios = require("axios");
const { generateEmbedding } = require("./embeddingService");
const { initVectorDB, addToVectorDB, searchVectorDB } = require("../utils/vectorDB");

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

initVectorDB();

// const fetchSearchResults = async (query) => {
//     try {
//         const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CSE_ID}`;
//         const response = await axios.get(googleSearchApiUrl);
//         const results = response.data.items.map((item) => ({
//             id: item.link,
//             title: item.title,
//             link: item.link,
//             snippet: item.snippet,
//         }));

//         // Store in FAISS
//         for (const result of results) {
//             const text = `${result.title} ${result.snippet}`;
//             const embedding = await generateEmbedding(text);
//             if (embedding) {
//                 addToVectorDB(result.id, embedding, result);
//             }
//         }

//         return results;
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//         return [];
//     }
// };

const fetchSearchResults = async (query) => {
    try {
        const MAX_RESULTS = 100;
        const RESULTS_PER_PAGE = 10; // Google CSE API allows max 10 per request
        const allResults = [];
        
        // Make multiple requests to get up to 100 results
        const totalPages = Math.ceil(MAX_RESULTS / RESULTS_PER_PAGE);
        
        for (let page = 0; page < totalPages; page++) {
            const startIndex = page * RESULTS_PER_PAGE + 1; // Google uses 1-based indexing
            
            const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CSE_ID}&start=${startIndex}&num=${RESULTS_PER_PAGE}`;
            
            console.log(`Fetching results ${startIndex} to ${startIndex + RESULTS_PER_PAGE - 1}...`);
            
            const response = await axios.get(googleSearchApiUrl);
            
            if (!response.data.items || response.data.items.length === 0) {
                // No more results available
                console.log(`No more results after index ${startIndex-1}`);
                break;
            }
            
            const pageResults = response.data.items.map((item) => ({
                id: item.link,
                title: item.title,
                link: item.link,
                snippet: item.snippet,
            }));
            
            allResults.push(...pageResults);
            
            // Process and add vectors for this batch
            for (const result of pageResults) {
                const text = `${result.title} ${result.snippet}`;
                const embedding = await generateEmbedding(text);
                if (embedding) {
                    addToVectorDB(result.id, embedding, result);
                }
            }
            
            // If we didn't get a full page, we've reached the end of results
            if (pageResults.length < RESULTS_PER_PAGE) {
                break;
            }
            
            // Optional: Add a small delay to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`Fetched a total of ${allResults.length} results`);
        return allResults;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

const fetchRankedResults = async (query) => {
    try {
        const queryEmbedding = await generateEmbedding(query);
        if (!queryEmbedding) return [];
        
        const rankedResults = searchVectorDB(queryEmbedding);
        
        // Log to see what's happening
        console.log(`Found ${rankedResults.length} ranked results for query: "${query}"`);
        
        // Transform the results to include all the necessary data
        return rankedResults.map(result => ({
            id: result.id,
            title: result.metadata.title || "No Title",
            link: result.metadata.link || result.id,
            snippet: result.metadata.snippet || "No Snippet",
            score: 1 - (result.distance / 2), // Convert distance to a 0-1 score
            distance: result.distance
        }));
    } catch (error) {
        console.error("Error fetching ranked results:", error);
        return [];
    }
};

module.exports = { fetchSearchResults, fetchRankedResults };