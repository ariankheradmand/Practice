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
  ExternalLink,
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
      <div className="w-full flex items-center gap-3 p-3">
        <div className="w-10 h-14 rounded-md bg-gradient-to-r from-gray-800/60 via-gray-700/60 to-gray-800/60 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-800/60 via-gray-700/60 to-gray-800/60 animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-gradient-to-r from-gray-800/60 via-gray-700/60 to-gray-800/60 animate-pulse rounded" />
        </div>
      </div>
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
          px-3 py-3 rounded-lg
          transition-all duration-300 ease-out
          ${
            isSelected
              ? "bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-purple-600/20 shadow-lg scale-[1.02]"
              : "hover:bg-white/5"
          }
          focus:outline-none focus:ring-2 focus:ring-purple-500/40
        `}
          aria-selected={isSelected}
          role="option"
        >
          <div className="flex items-center gap-3">
            {/* Thumbnail with gradient overlay */}
            <div className="relative w-10 h-14 rounded-md overflow-hidden bg-gray-800/50 shrink-0 shadow-md group-hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              {data.poster_path || data.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${
                    data.poster_path || data.profile_path
                  }`}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon
                    className="w-5 h-5 text-gray-600"
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {/* Media type badge */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center py-0.5 text-[8px] font-medium text-white/80 bg-black/60">
                {filterSearches === "movie"
                  ? "MOVIE"
                  : filterSearches === "tv"
                  ? "TV"
                  : "PERSON"}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={`
                font-medium truncate text-sm leading-tight
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

              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
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
                    <span className="text-[10px] font-medium text-gray-300">
                      {rating}%
                    </span>
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

              {/* Overview snippet for movies/TV (if available) */}
              {["movie", "tv"].includes(filterSearches) && data.overview && (
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                  {data.overview}
                </p>
              )}
            </div>

            {/* Arrow / Selection indicator */}
            <div
              className={`
                transform transition-all duration-300 shrink-0
                ${
                  isSelected
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                }
              `}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <ChevronRight
                  className="w-4 h-4 text-purple-300"
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

    const detailLink = `/results/${getLinkPath(filterSearches)}/${
      results[selectedMovie]?.id
    }`;

    return (
      <div className="relative h-full w-full">
        <Link
          href={detailLink}
          className={`
            group relative h-full w-full overflow-hidden rounded-xl
            transform transition-all duration-500 ease-out block
            hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/40
            ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }
          `}
          aria-label={`View details for ${posterAlt}`}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

          <img
            className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            src={`https://image.tmdb.org/t/p/original${
              posterPath || profilePath
            }`}
            alt={posterAlt}
            loading="lazy"
          />

          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
              {posterAlt}
            </h3>

            <div className="flex items-center mt-1.5">
              <Link
                href={detailLink}
                className="text-xs sm:text-sm text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                View details <ExternalLink className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </Link>

        {/* Known for section for person */}
        {filterSearches === "person" && results[selectedMovie]?.known_for && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-black/0">
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
                      : item.title || item.name || "Unknown"}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
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
    <div
      className="w-full relative rounded-xl shadow-lg overflow-hidden
                 bg-gradient-to-br from-gray-900/90 to-black/90
                 border border-white/10"
      role="listbox"
      aria-label="Search results"
    >
      <div className="flex flex-col sm:flex-row">
        {/* List of results */}
        <div className="w-full sm:w-1/2 max-h-60 sm:max-h-96 flex flex-col p-1 overflow-y-auto border-r border-white/5">
          <div className="sticky top-0 z-10 px-3 py-2 backdrop-blur-sm bg-black/30 border-b border-white/5 text-xs font-medium text-gray-400">
            {loading
              ? "Searching..."
              : results.length > 0
              ? `${results.length} results found`
              : "No results"}
          </div>

          <div className="flex-1">
            {loading ? (
              <>
                <LoadingPulse />
                <LoadingPulse />
                <LoadingPulse />
              </>
            ) : results.length > 0 ? (
              results.map((data, index) => (
                <ResultItem key={index} data={data} index={index} />
              ))
            ) : (
              <NoResults />
            )}
          </div>
        </div>

        {/* Preview section - Fixed for mobile */}
        <div className="w-full sm:w-1/2 h-48 sm:h-96 flex items-center justify-center bg-gradient-to-br from-gray-900/40 to-black/40">
          <ImageSection />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
