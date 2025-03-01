import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";
import SearchResults from "./SearchResults";
import FilterButtons from "./FilterButtons";
import { Search } from "lucide-react";

const collection = ["movie", "tv", "person"];

const Searchabar = ({ openSearchBar, endOfPage }) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [filterSearches, setFilterSearches] = useState("movie");
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 300); // Increased debounce delay for better performance

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle API requests with debounced input
  useEffect(() => {
    const Search = async () => {
      setLoading(true);
      try {
        const data = await fetchData(
          `/search/${filterSearches}?query=${debouncedSearchInput}`,
          {
            language: "en-US",
            page: 1,
          }
        );
        setResults((data.results || []).slice(0, 7));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    if (debouncedSearchInput.length > 2) {
      Search();
    } else {
      setResults([]);
    }
  }, [debouncedSearchInput, filterSearches]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" strokeWidth={2} />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search movies, TV shows, or people..."
          className={`
            w-full h-10 pl-10 pr-4 
            bg-white/10 backdrop-blur-sm
            text-white placeholder-gray-400
            rounded-lg border border-white/10
            focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
            transition-all duration-200
          `}
        />
      </div>

      {/* Search Results */}
      {openSearchBar &&
        (results.length > 0 || debouncedSearchInput.length > 2) && (
          <div className="absolute left-0 right-0 mt-2">
            <FilterButtons
              collection={collection}
              filterSearches={filterSearches}
              setFilterSearches={setFilterSearches}
              openSearchBar={openSearchBar}
              endOfPage={endOfPage}
            />
            <div className="mt-2">
              <SearchResults
                results={results}
                selectedMovie={selectedMovie}
                filterSearches={filterSearches}
                loading={loading}
                imageLoading={imageLoading}
                posterPath={results[selectedMovie]?.poster_path}
                profilePath={results[selectedMovie]?.profile_path}
                posterAlt={
                  results[selectedMovie]?.title || results[selectedMovie]?.name
                }
                setSelectedMovie={setSelectedMovie}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default Searchabar;
