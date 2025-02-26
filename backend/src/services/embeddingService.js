import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text) {
    try {
        // Validate input
        if (!text || typeof text !== "string" || text.trim().length === 0) {
            throw new Error("Invalid text input for embedding. It must be a non-empty string.");
        }

        const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });

        const response = await model.embedContent({
            model: "models/text-embedding-004", // Ensure the correct model is used
            content: {
                parts: [{ text: text }] // Proper format for Gemini API
            }
        });

        if (!response || !response.embedding || !response.embedding.values) {
            throw new Error("Invalid response from Gemini API.");
        }

        return response.embedding.values; // Returns the embedding array
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}
