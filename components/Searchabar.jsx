import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";
import SearchResults from "./SearchResults";
import FilterButtons from "./FilterButtons";
import { Search, Loader2 } from "lucide-react";

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

  // Reset selected movie when results change
  useEffect(() => {
    if (results.length > 0) {
      setSelectedMovie(0);
    }
  }, [results]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2
              className="w-4 h-4 text-purple-400 animate-spin"
              strokeWidth={2}
            />
          ) : (
            <Search className="w-4 h-4 text-gray-400" strokeWidth={2} />
          )}
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search movies, TV shows, or people..."
          className={`
            w-full h-11 pl-10 pr-4 
            bg-gray-900/80 backdrop-blur-md
            text-white placeholder-gray-400
            rounded-xl border ${
              loading ? "border-purple-500/30" : "border-white/10"
            }
            focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
            transition-all duration-200 shadow-md
          `}
        />
      </div>

      {/* Search Results */}
      {openSearchBar && (
        <div className="absolute left-0 right-0 mt-2 z-50">
          <div className="mx-auto bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden">
            <div className="p-2">
              <div className="mb-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg shadow-inner">
                <FilterButtons
                  collection={collection}
                  filterSearches={filterSearches}
                  setFilterSearches={setFilterSearches}
                  openSearchBar={openSearchBar}
                  endOfPage={endOfPage}
                />
              </div>

              {/* Always show the SearchResults component when search input is long enough */}
              {debouncedSearchInput.length > 2 && (
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
                      results[selectedMovie]?.title ||
                      results[selectedMovie]?.name
                    }
                    setSelectedMovie={setSelectedMovie}
                  />
                </div>
              )}

              {/* Show a prompt to search when no input or input is too short */}
              {(!debouncedSearchInput || debouncedSearchInput.length <= 2) && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-500 opacity-40" />
                  </div>
                  <p className="text-gray-300 font-medium text-sm mb-1">
                    {searchInput.length === 0
                      ? "What would you like to watch?"
                      : "Keep typing to search..."}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs max-w-xs mx-auto">
                    {searchInput.length === 0
                      ? "Search for movies, TV shows or people"
                      : `Type at least 3 characters to search for "${searchInput}"`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchabar;
