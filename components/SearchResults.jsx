import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  Calendar,
  ChevronRight,
  Search as SearchIcon,
  Image as ImageIcon,
  Award,
  TrendingUp,
} from "lucide-react";

// Utility function for path generation
const getLinkPath = (filterSearches) =>
  ({
    movie: "movie",
    tv: "tv",
    person: "person",
  }[filterSearches] || "");

const SearchResults = ({
  results,
  selectedMovie,
  filterSearches,
  loading,
  posterPath,
  profilePath,
  posterAlt,
  setSelectedMovie,
}) => {
  const [isHovered, setIsHovered] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debounced transition handler
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [selectedMovie]);

  // Memoized loading component
  const LoadingPulse = useCallback(
    () => (
      <div
        className="w-full h-16 rounded-lg bg-gradient-to-r from-gray-800/40 via-gray-700/40 to-gray-800/40 animate-pulse"
        role="progressbar"
        aria-label="Loading results"
      />
    ),
    []
  );

  // Enhanced no results state
  const NoResults = useCallback(
    () => (
      <div className="w-full h-full flex items-center flex-col justify-center py-8 text-gray-400">
        <div className="w-16 h-16 mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
          <SearchIcon
            className="w-full h-full text-gray-500 opacity-30"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          No matches found
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Try adjusting your search terms
        </p>
      </div>
    ),
    []
  );

  const ResultItem = useCallback(
    ({ data, index }) => {
      const isSelected = selectedMovie === index;
      const title = data.title || data.name || "Untitled";
      const year = data.release_date || data.first_air_date;
      const rating = data.vote_average
        ? Math.round(data.vote_average * 10)
        : null;

      return (
        <button
          onMouseEnter={() => setIsHovered(index)}
          onMouseLeave={() => setIsHovered(null)}
          onClick={() => setSelectedMovie(index)}
          className={`
          group relative w-full text-left
          px-3 py-2.5 rounded-lg
          transition-all duration-300 ease-out
          ${
            isSelected
              ? "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 shadow-lg scale-[1.02]"
              : "hover:bg-white/5"
          }
          focus:outline-none focus:ring-2 focus:ring-purple-500/40
        `}
          aria-selected={isSelected}
          role="option"
        >
          <div className="flex items-center gap-2.5">
            {/* Thumbnail */}
            <div className="relative w-9 h-12 sm:w-10 sm:h-14 rounded-md overflow-hidden bg-gray-800/50 shrink-0">
              {data.poster_path || data.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${
                    data.poster_path || data.profile_path
                  }`}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={`
              font-medium truncate text-xs sm:text-sm
              ${
                isSelected
                  ? "text-white"
                  : "text-gray-200 group-hover:text-white"
              }
              transition-colors duration-200
            `}
              >
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                {["movie", "tv"].includes(filterSearches) && year && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    <span className="text-[10px]">
                      {new Date(year).getFullYear()}
                    </span>
                  </div>
                )}
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" strokeWidth={2} />
                    <span className="text-[10px] text-gray-400">{rating}%</span>
                  </div>
                )}
                {data.popularity && (
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className="w-3 h-3 text-emerald-500"
                      strokeWidth={2}
                    />
                    <span className="text-[10px] text-gray-400">
                      {Math.round(data.popularity)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div
              className={`
              transform transition-all duration-300 shrink-0
              ${
                isSelected
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0"
              }
            `}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                <ChevronRight
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </button>
      );
    },
    [selectedMovie, filterSearches, setSelectedMovie]
  );

  const ImageSection = useCallback(() => {
    if (loading) {
      return (
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-gray-800/40 via-gray-700/40 to-gray-800/40 animate-pulse" />
      );
    }

    if (!posterPath && !profilePath) {
      return (
        <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 flex items-center justify-center">
          <ImageIcon
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 opacity-20"
            strokeWidth={1.5}
          />
        </div>
      );
    }

    return (
      <Link
        href={`/results/${getLinkPath(filterSearches)}/${
          results[selectedMovie]?.id
        }`}
        className={`
          group relative h-full w-full overflow-hidden rounded-xl
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/40
          ${
            isTransitioning
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }
        `}
        aria-label={`View details for ${posterAlt}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          src={`https://image.tmdb.org/t/p/original${
            posterPath || profilePath
          }`}
          alt={posterAlt}
          loading="lazy"
        />

        {filterSearches === "person" && results[selectedMovie]?.known_for && (
          <div className="absolute bottom-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-purple-400" strokeWidth={2} />
              <h3 className="font-medium text-xs sm:text-sm text-white">
                Known For
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {results[selectedMovie].known_for
                .slice(0, 3)
                .map((item, index) => (
                  <span
                    key={item.id || index}
                    className="bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full"
                  >
                    {item.title?.length > 25
                      ? `${item.title.slice(0, 25)}...`
                      : item.title}
                  </span>
                ))}
            </div>
          </div>
        )}
      </Link>
    );
  }, [
    loading,
    posterPath,
    profilePath,
    filterSearches,
    results,
    selectedMovie,
    posterAlt,
    isTransitioning,
  ]);

  return (
    <div className="fixed inset-x-0 top-24 mx-auto z-50 px-4 sm:px-6 lg:px-8 max-w-screen-lg">
      <div
        className="w-full relative rounded-xl flex flex-col sm:flex-row shadow-2xl
                   min-h-[360px] sm:min-h-[420px] overflow-hidden
                   bg-gradient-to-br from-gray-900/95 to-black
                   border border-white/10"
        role="listbox"
        aria-label="Search results"
      >
        <div className="w-full sm:w-[45%] h-48 sm:h-full flex flex-col p-2.5 space-y-1.5 overflow-y-auto">
          {results.length > 0 && results[0]?.name !== "" ? (
            results.map((data, index) =>
              loading ? (
                <LoadingPulse key={index} />
              ) : (
                <ResultItem key={index} data={data} index={index} />
              )
            )
          ) : (
            <NoResults />
          )}
        </div>
        <div className="w-full sm:w-[55%] h-48 sm:h-full p-2.5 flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-black/50">
          <ImageSection />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
