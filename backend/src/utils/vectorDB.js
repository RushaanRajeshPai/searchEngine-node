// const faiss = require("faiss-node");

// let index;
// const embeddingDim = parseInt(process.env.EMBEDDING_DIM) || 768;
// const metadataStore = new Map(); 

// function initVectorDB() {
//     index = new faiss.IndexFlatL2(embeddingDim);
//     console.log("FAISS Vector Database Initialized");
// }

// // Add Embeddings to FAISS
// function addToVectorDB(id, embedding, metadata = {}) {
//     if (!Array.isArray(embedding) || embedding.length !== embeddingDim) {
//         throw new Error(`Invalid embedding format. Expected array of length ${embeddingDim}`);
//     }

//     if (!index) {
//         throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
//     }

//     // Convert to Float32Array
//     const embeddingVector = new Float32Array(embedding);

//     // Add the vector to the index
//     console.log(`Index size before adding: ${index.ntotal}`);
//     index.add([embeddingVector]);
//     console.log(`Index size after adding: ${index.ntotal}`);    

//     metadataStore.set(id, metadata); 
//     console.log(`Vector added for ID: ${id}`);
// }

// function searchVectorDB(queryEmbedding, topK = 5) {
//     if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== embeddingDim) {
//         throw new Error(`Invalid query embedding format. Expected array of length ${embeddingDim}`);
//     }

//     if (!index) {
//         throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
//     }

//     if (index.ntotal === 0) {
//         console.log("No vectors in FAISS database yet.");
//         return [];
//     }

//     const queryVector = new Float32Array(queryEmbedding);
//     console.log(queryVector)
//     const result = index.search([queryVector], topK);

//     return result.labels.map((id, idx) => ({
//         id,
//         metadata: metadataStore.get(id) || {},
//         distance: result.distances[idx]
//     }));
// }

// module.exports = { initVectorDB, addToVectorDB, searchVectorDB };


// const faiss = require("faiss-node");

// let index;
// const embeddingDim = parseInt(process.env.EMBEDDING_DIM) || 768;
// const metadataStore = new Map(); 

// function initVectorDB() {
//     try {
//         index = new faiss.IndexFlatL2(embeddingDim);
//         console.log("FAISS Vector Database Initialized with dimension:", embeddingDim);
//         return true;
//     } catch (error) {
//         console.error("Failed to initialize FAISS:", error.message);
//         return false;
//     }
// }

// // Add Embeddings to FAISS
// function addToVectorDB(id, embedding, metadata = {}) {
//     if (!index) {
//         throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
//     }

//     // Validate embedding
//     if (!Array.isArray(embedding)) {
//         throw new Error(`Invalid embedding format. Expected array but got ${typeof embedding}`);
//     }
    
//     // Handle both regular arrays and Float32Arrays
//     let embeddingArray = embedding;
    
//     // Extract the numeric values if we have a Float32Array that's displayed as a string
//     if (typeof embedding === 'string') {
//         try {
//             // Try to parse if it's a stringified array
//             embeddingArray = JSON.parse(embedding);
//         } catch (e) {
//             // If it's not a valid JSON string, try to extract numbers
//             const matches = embedding.match(/(-?\d+\.\d+)/g);
//             if (matches) {
//                 embeddingArray = matches.map(Number);
//             } else {
//                 throw new Error('Could not parse embedding string to numeric array');
//             }
//         }
//     }
    
//     // Final validation of array length
//     if (embeddingArray.length !== embeddingDim) {
//         throw new Error(`Invalid embedding dimension. Expected ${embeddingDim} but got ${embeddingArray.length}`);
//     }

//     // Convert to Float32Array (ensure it's a fresh array)
//     const embeddingVector = new Float32Array(embeddingArray);

//     try {
//         // Add the vector to the index
//         console.log(`Index size before adding: ${index.ntotal}`);
//         index.add([embeddingVector]);
//         console.log(`Index size after adding: ${index.ntotal}`);    

//         // Store metadata with id
//         metadataStore.set(id, metadata); 
//         console.log(`Vector added for ID: ${id}`);
//         return true;
//     } catch (error) {
//         console.error(`Failed to add vector for ID ${id}:`, error.message);
//         return false;
//     }
// }

// function searchVectorDB(queryEmbedding, topK = 5) {
//     if (!index) {
//         throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
//     }

//     // Check if index is empty
//     if (index.ntotal === 0) {
//         console.log("No vectors in FAISS database yet.");
//         return [];
//     }

//     // Validate query embedding
//     if (!Array.isArray(queryEmbedding)) {
//         throw new Error(`Invalid query embedding format. Expected array but got ${typeof queryEmbedding}`);
//     }
    
//     // Handle both regular arrays and Float32Arrays
//     let queryArray = queryEmbedding;
    
//     // Similar handling as in addToVectorDB
//     if (typeof queryEmbedding === 'string') {
//         try {
//             queryArray = JSON.parse(queryEmbedding);
//         } catch (e) {
//             const matches = queryEmbedding.match(/(-?\d+\.\d+)/g);
//             if (matches) {
//                 queryArray = matches.map(Number);
//             } else {
//                 throw new Error('Could not parse query embedding string to numeric array');
//             }
//         }
//     }
    
//     if (queryArray.length !== embeddingDim) {
//         throw new Error(`Invalid query embedding dimension. Expected ${embeddingDim} but got ${queryArray.length}`);
//     }

//     // Prepare query vector
//     const queryVector = new Float32Array(queryArray);
    
//     try {
//         // Ensure topK is valid - cannot be greater than ntotal
//         const actualK = Math.min(topK, index.ntotal);
//         console.log(`Searching for top ${actualK} results out of ${index.ntotal} vectors`);
        
//         // Perform search
//         const result = index.search([queryVector], actualK);

//         // Map results to include metadata
//         return result.labels[0].map((id, idx) => ({
//             id,
//             metadata: metadataStore.get(id) || {},
//             distance: result.distances[0][idx]
//         }));
//     } catch (error) {
//         console.error("Search failed:", error.message);
//         return [];
//     }
// }

// // Add a function to get index stats
// function getIndexStats() {
//     if (!index) {
//         return { initialized: false };
//     }
    
//     return {
//         initialized: true,
//         dimension: embeddingDim,
//         count: index.ntotal,
//         metadataCount: metadataStore.size
//     };
// }

// module.exports = { initVectorDB, addToVectorDB, searchVectorDB, getIndexStats };


const faiss = require("faiss-node");
let index;
const embeddingDim = parseInt(process.env.EMBEDDING_DIM) || 768;
const metadataStore = new Map(); 
const idToIndex = new Map(); 
let currentIndex = 0; 

function initVectorDB() {
    index = new faiss.IndexFlatL2(embeddingDim);
    metadataStore.clear();
    idToIndex.clear();
    currentIndex = 0;
    console.log("FAISS Vector Database Initialized");
}

// Add Embeddings to FAISS
function addToVectorDB(id, embedding, metadata = {}) {
    // Basic validation
    if (!Array.isArray(embedding) || embedding.length !== embeddingDim) {
        throw new Error(`Invalid embedding format. Expected array of length ${embeddingDim}`);
    }
    
    if (!index) {
        throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
    }
    
    const beforeCount = typeof index.ntotal === 'function' ? index.ntotal() : 'unknown';
    console.log(`Index size before adding: ${beforeCount}`);
    
    try {
        // Use the approach that works - passing embedding directly
        index.add(embedding);
        
        // Store the mapping between custom ID and FAISS index
        idToIndex.set(id, currentIndex);
        metadataStore.set(currentIndex, { originalId: id, ...metadata });
        currentIndex++;
        
        const afterCount = typeof index.ntotal === 'function' ? index.ntotal() : 'unknown';
        console.log(`Index size after adding: ${afterCount}`);
        console.log(`Vector added for ID: ${id}`);
        return true;
    } catch (error) {
        console.error("Error adding vector to FAISS:", error.message);
        throw error;
    }
}

function searchVectorDB(queryEmbedding, topK = 5) {
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== embeddingDim) {
        throw new Error(`Invalid query embedding format. Expected array of length ${embeddingDim}`);
    }
    
    if (!index) {
        throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
    }
    
    if (currentIndex === 0) {
        console.log("No vectors in FAISS database yet.");
        return [];
    }
    
    try {
        // Use the approach that works - passing queryEmbedding directly
        const result = index.search(queryEmbedding, topK);
        
        // Handle results
        if (!result || !result.labels || !result.distances) {
            console.log("Unexpected search result format:", result);
            return [];
        }
        
        return result.labels.map((faissIndex, idx) => {
            const metadata = metadataStore.get(faissIndex) || {};
            return {
                id: metadata.originalId,
                metadata: metadata,
                distance: result.distances[idx]
            };
        });
    } catch (error) {
        console.error("Error searching FAISS:", error.message);
        throw error;
    }
}

// Function to save the FAISS index to disk
function saveVectorDB(filePath) {
    if (!index) {
        throw new Error("FAISS index is not initialized. Call initVectorDB() first.");
    }
    
    try {
        // Save FAISS index
        index.save(filePath);
        
        // You'd need to save metadata and ID mappings separately
        console.log("FAISS index saved to:", filePath);
        return true;
    } catch (error) {
        console.error("Error saving FAISS index:", error.message);
        throw error;
    }
}

// Function to load a saved FAISS index
function loadVectorDB(filePath, metadata, idMapping, savedIndex) {
    try {
        // Create a new index first
        index = new faiss.IndexFlatL2(embeddingDim);
        
        // Load the saved index
        index.load(filePath);
        
        // Restore metadata and ID mappings if provided
        if (metadata) {
            metadataStore.clear();
            Object.entries(metadata).forEach(([key, value]) => {
                metadataStore.set(parseInt(key), value);
            });
        }
        
        if (idMapping) {
            idToIndex.clear();
            Object.entries(idMapping).forEach(([key, value]) => {
                idToIndex.set(key, value);
            });
        }
        
        // Restore the current index counter
        currentIndex = savedIndex || (typeof index.ntotal === 'function' ? index.ntotal() : 0);
        
        console.log("FAISS index loaded from:", filePath);
        console.log("Current vector count:", currentIndex);
        
        return true;
    } catch (error) {
        console.error("Error loading FAISS index:", error.message);
        throw error;
    }
}

module.exports = { 
    initVectorDB, 
    addToVectorDB, 
    searchVectorDB,
    saveVectorDB,
    loadVectorDB
};