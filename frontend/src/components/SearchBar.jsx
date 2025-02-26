import { useState } from "react";
import axios from "axios";

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search?query=${query}`);
      setResults(data.results); 
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your search query" />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
