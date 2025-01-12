import Link from "next/link";
import React from "react";

const getLinkPath = (filterSearches) => {
  if (["movie"].includes(filterSearches)) return "movie";
  if (["tv"].includes(filterSearches)) return "tv";
  if (["person"].includes(filterSearches)) return "person";
  return "";
};

const SearchResults = ({
  results,
  selectedMovie,
  filterSearches,
  loading,
  imageLoading,
  posterPath,
  profilePath,
  posterAlt,
  setSelectedMovie,
}) => {
  const getMoviePath = (filterSearches) => {
    if (["movie"].includes(filterSearches)) {
      return `${results[selectedMovie]?.id}`;
    }
    if (["tv"].includes(filterSearches)) {
      return `${results[selectedMovie]?.id}`;
    }else {
      return `${results[selectedMovie]?.id}`;
    }
}
  return (
    <>
      <div className="w-full relative rounded-md flex shadow-md border min-h-[342px] ">
        <div className="w-full bg-gradient-to-br from-gray-100 to-gray-900/[0.95] blur-sm bg-[length:200%_200%] animate-gradient absolute h-full rounded-md"></div>
        <div className="w-6/12 h-full flex flex-col z-10 gap-3 py-2 pl-2 font-thin text-sm">
          {results.length > 0 && results[0]?.name !== "" ? (
            results.map((data, index) => (
              <div key={index} className="flex items-center w-full text-start">
                {loading ? (
                  <div className="w-full h-[36px] rounded-md bg-gradient-to-r py-2 from-white/60 to-black/60 bg-[length:200%_200%] animate-gradient"></div>
                ) : (
                  <div
                    onClick={() => setSelectedMovie(index)}
                    className={`flex items-center ${
                      selectedMovie === index ? "bg-gray-900" : "bg-gray-700"
                    } justify-between shadow-md w-full text-white pl-2 pr-1 py-2 rounded-md`}
                  >
                    <h2>
                      {(() => {
                        const title = data.title || data.name || "Unknown";
                        return title.length > 16
                          ? `${title.slice(0, 16)}...`
                          : title;
                      })()}
                    </h2>

                    {["movie", "tv"].includes(filterSearches) && (
                      <h2>
                        {data.release_date || data.first_air_date
                          ? new Date(
                              data.release_date || data.first_air_date
                            ).getFullYear()
                          : "N/A"}
                      </h2>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center flex-col justify-center text-white">
              <img className="w-20 h-20" src="/NotFound.svg" />
              <div>Nothing Found :(</div>
            </div>
          )}
        </div>
        <div className="w-6/12 py-2 h-full z-10 flex items-center justify-center">
          {loading === true ? (
            <div className="w-11/12 h-full rounded-md bg-gradient-to-r from-white/30 to-black/30 animate-gradient"></div>
          ) : (posterPath || profilePath) === "" ? (
            <img
              className="h-5/6 w-11/12 rounded-md"
              src="/BrokenImage.svg"
              alt={posterAlt}
            />
          ) : imageLoading ? (
            <div className="w-11/12 h-5/6 rounded-md bg-gradient-to-r from-white/30 to-black/30 animate-gradient"></div>
          ) : (
            <Link
            href={`/results/${getLinkPath(filterSearches)}/${getMoviePath(filterSearches)}`}
            className="h-full w-11/12 relative cursor-pointer"
            >
              <img
                className="h-full w-full object-cover rounded-md"
                src={`https://image.tmdb.org/t/p/original${
                  posterPath || profilePath
                }`}
                alt={posterAlt}
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
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
