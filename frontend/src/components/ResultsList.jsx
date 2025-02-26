const ResultsList = ({ results }) => {
  return (
    <div>
      <h2>Search Results :</h2>
      <ul>
        {results?.map((result, index) => (
          <li key={index}>
            <a href={result.link} target="_blank" rel="noopener noreferrer">
              <h3>{result.title}</h3>
            </a>
            <p>{result.snippet}</p>
          </li>
        ))}
      </ul>
    </div> 
  );
};

export default ResultsList;
