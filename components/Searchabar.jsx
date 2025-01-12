import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";
import SearchResults from "./SearchResults";
import FilterButtons from "./FilterButtons";

const collection = ["movie", "tv", "person"];

const Searchabar = ({ openSearchBar, endOfPage }) => {
  const [animationWidth, setAnimationWidth] = useState(0);
  const [closingAnimationWidth, setClosingAnimationWidth] = useState(true);
  const [searchInput, setSearchInput] = useState("game");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("game");
  const [filterSearches, setFilterSearches] = useState("movie");
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 100); // Adjust debounce delay as needed

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
        setResults((data.results || []).slice(0, 7)); // Ensure results is always an array and take only the first 7 elements
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    if (debouncedSearchInput.length > 2) {
      Search();
    }
  }, [debouncedSearchInput, filterSearches]);

  // Handle search bar animation
  useEffect(() => {
    let interval;

    if (openSearchBar) {
      setClosingAnimationWidth(true);
      interval = setInterval(() => {
        setAnimationWidth((prev) => {
          if (prev >= 180) {
            clearInterval(interval);
            return 180;
          }
          return prev + 5;
        });
      }, 20);
    } else {
      interval = setInterval(() => {
        setAnimationWidth((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 5;
        });
        setClosingAnimationWidth((prev) => !prev);
      }, 20);
    }

    return () => clearInterval(interval);
  }, [openSearchBar]);

  const posterPath = results[selectedMovie]?.poster_path || "";
  const profilePath = results[selectedMovie]?.profile_path || "";

  useEffect(() => {
    if (posterPath || profilePath) {
      setImageLoading(true);
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${
        posterPath || profilePath
      }`;
      img.onload = () => setImageLoading(false);
      img.onerror = () => setImageLoading(false);
    } else {
      setImageLoading(false);
    }
  }, [posterPath, profilePath]);

  const posterAlt = results[selectedMovie]?.title || "";
  return (
    <div className="flex w-full items-center justify-center">
      {openSearchBar ? (
        <div
          className={`z-30 w-full absolute ${
            endOfPage ? "-top-[450px]" : "top-40"
          } flex animate__animated animate__fadeIn`}
        >
          <div className="w-full relative rounded-md flex shadow-md border min-h-[342px]">
            <SearchResults
              results={results}
              selectedMovie={selectedMovie}
              filterSearches={filterSearches}
              loading={loading}
              imageLoading={imageLoading}
              posterPath={posterPath}
              profilePath={profilePath}
              posterAlt={posterAlt}
              setSelectedMovie={setSelectedMovie}
            />
          </div>
        </div>
      ) : null}
      

      <div className="relative w-11/12 flex flex-col items-center justify-center">
        <input
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search"
          style={{ width: `${animationWidth}px` }}
          className={`${
            closingAnimationWidth ? "visible" : "invisible"
          } bg-white/20 text-white placeholder:text-white/60 font-thin h-[24px] pl-1 rounded-md transition-all`}
        />
        <FilterButtons
          collection={collection}
          filterSearches={filterSearches}
          setFilterSearches={setFilterSearches}
          openSearchBar={openSearchBar}
          endOfPage={endOfPage}
        />
      </div>
    </div>
  );
};

export default Searchabar;
