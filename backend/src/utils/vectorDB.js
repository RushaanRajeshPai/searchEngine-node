const faiss = require("faiss-node");

let index;
const embeddingDim = parseInt(process.env.EMBEDDING_DIM) || 768;
const metadataStore = new Map(); 

function initVectorDB() {
    index = new faiss.IndexFlatL2(embeddingDim);
    console.log("FAISS Vector Database Initialized");
}

// Add Embeddings to FAISS
function addToVectorDB(id, embedding, metadata = {}) {
    if (!Array.isArray(embedding) || embedding.length !== embeddingDim) {
        throw new Error(`Invalid embedding format. Expected array of length ${embeddingDim}`);
    }

    if (!index) {
        throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
    }

    // Convert to Float32Array
    const embeddingVector = new Float32Array(embedding);

    // Add the vector to the index
    index.add(embeddingVector);
    metadataStore.set(id, metadata); 
    console.log(`Vector added for ID: ${id}`);
}

function searchVectorDB(queryEmbedding, topK = 5) {
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== embeddingDim) {
        throw new Error(`Invalid query embedding format. Expected array of length ${embeddingDim}`);
    }

    if (!index) {
        throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
    }

    if (index.ntotal === 0) {
        console.log("No vectors in FAISS database yet.");
        return [];
    }

    // Convert to Float32Array
    const queryVector = new Float32Array(queryEmbedding);
    
    // Fix: Pass queryVector directly instead of wrapping it in an array
    const result = index.search(queryVector, topK);

    return result.labels.map((id, idx) => ({
        id,
        metadata: metadataStore.get(id) || {},
        distance: result.distances[idx]
    }));
}

module.exports = { initVectorDB, addToVectorDB, searchVectorDB };