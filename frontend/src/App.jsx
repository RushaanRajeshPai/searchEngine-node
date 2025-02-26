import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";

function App() {
  const [results, setResults] = useState(null);

  return (
    <div>
      <h2>Web Search Engine</h2>
      <SearchBar setResults={setResults} />
      {results && <ResultsList results={results} />}
    </div>
  );
}

export default App;
