import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";

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
            endOfPage ? "-top-[340px]" : "top-40"
          }  flex animate__animated animate__fadeIn`}
        >
          <div className="w-full relative rounded-md flex shadow-md border min-h-[342px]">
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-900/[0.95] blur-sm bg-[length:200%_200%] animate-gradient absolute h-full rounded-md"></div>
            <div className="w-6/12 h-full flex flex-col z-10 gap-3 py-2 pl-2 font-thin text-sm">
              {results.length > 0 && results[0]?.name !== "" ? (
                results.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center w-full text-start"
                  >
                    {loading ? (
                      <div className="w-full h-[36px] rounded-md bg-gradient-to-r py-2 from-white/60 to-black/60 bg-[length:200%_200%] animate-gradient"></div>
                    ) : (
                      <div
                        onClick={() => setSelectedMovie(index)}
                        className={`flex items-center ${
                          selectedMovie === index
                            ? "bg-gray-900"
                            : "bg-gray-700"
                        } justify-between shadow-md w-full text-white pl-2 pr-1 py-2 rounded-md`}
                      >
                        <h2 >
                          {(
                            data.title ||
                            data.original_name ||
                            "Unknown"
                          ).slice(0, 16)}
                        </h2>

                        {filterSearches === "movie" && (
                          <h2>
                            {data.release_date
                              ? new Date(data.release_date).getFullYear()
                              : "N/A"}
                          </h2>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center flex-col justify-center text-white">
                  <img className="w-20 h-20" src={"/NotFound.svg"} />{" "}
                  <div> Nothing Found :( </div>
                </div>
              )}
            </div>
            <div className="w-6/12 py-2 h-full z-10 flex items-center justify-center">
              {loading === true ? (
                <div className="w-11/12 h-full rounded-md bg-gradient-to-r from-white/30 to-black/30 animate-gradient"></div>
              ) : (posterPath || profilePath) === "" ? (
                <img
                  className="h-5/6 w-11/12 rounded-md"
                  src={`/BrokenImage.svg`}
                  alt={`${posterAlt}`}
                />
              ) : imageLoading ? (
                <div className="w-11/12 h-5/6 rounded-md bg-gradient-to-r from-white/30 to-black/30 animate-gradient"></div>
              ) : (
                <div className="h-full w-11/12 relative">
                  <img
                    className="h-full w-full object-cover rounded-md"
                    src={`https://image.tmdb.org/t/p/original${
                      posterPath || profilePath
                    }`}
                    alt={`${posterAlt}`}
                    loading="lazy"
                  />
                  {filterSearches === "person" && (
                    <div className="font-normal absolute bottom-0 w-full h-24 p-2 flex flex-col items-start justify-start shadow-md bg-gradient-to-r from-white/60 to-white/90 bg-[length:200%_200%] animate-gradient rounded-b-md">
                      <span className="font-bold">Known For:</span>
                      <div className="flex gap-1 text-[9px]">
                        {results[selectedMovie]?.known_for
                          ?.slice(0, 2)
                          .map((knownForItem) => (
                            <div
                              className="bg-gray-400 rounded-md p-px"
                              key={knownForItem.id || index}
                            >
                              {(() => {
                                const title = knownForItem.title ?? "";
                                return title.length > 40
                                  ? title.slice(0, 40) + "..."
                                  : title;
                              })()}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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
        <div
          className={`${
            openSearchBar ? "visible" : "invisible"
          } flex items-center justify-start relative text-white gap-2 w-[160px] left-0`}
        >
          <div
            className={`absolute ${
              endOfPage
                ? "left-0 -top-[70px] rounded-t-md border-x-2 border-t-2"
                : "left-0 top-3 rounded-b-md border-x-2 border-b-2"
            } bg-white/50 backdrop-blur-md w-full flex justify-center`}
          >
            {collection.map((data, index) => (
              <div className="relative" key={index}>
                <button
                  onClick={() => setFilterSearches(data)}
                  value={data}
                  className={`${
                    filterSearches === data ? "bg-black/50" : "bg-black/30"
                  } py-1 px-2`}
                >
                  {data}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchabar;
