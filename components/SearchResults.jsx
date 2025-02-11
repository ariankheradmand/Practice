import React, { useState, useEffect } from 'react';
import Link from "next/link";

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
  const [isHovered, setIsHovered] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle smooth transitions when selected movie changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [selectedMovie]);

  const LoadingPulse = () => (
    <div 
      className="w-full h-[36px] rounded-md bg-gradient-to-r from-gray-200/10 to-gray-300/10 animate-pulse"
      role="progressbar"
      aria-label="Loading results"
    />
  );

  const NoResults = () => (
    <div className="w-full h-full flex items-center flex-col justify-center text-gray-400 space-y-4">
      <div className="w-24 h-24 mb-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-60">
          <path 
            d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="text-lg font-medium">No Results Found</h2>
      <p className="text-sm">Try adjusting your search terms</p>
    </div>
  );

  const ResultItem = ({ data, index }) => {
    const isSelected = selectedMovie === index;
    const title = data.title || data.name || "Unknown";
    const year = data.release_date || data.first_air_date;
    
    return (
      <button
        onMouseEnter={() => setIsHovered(index)}
        onMouseLeave={() => setIsHovered(null)}
        onClick={() => setSelectedMovie(index)}
        className={`
          w-full text-left transition-all duration-300 ease-out
          ${isSelected ? 'bg-gray-800/90 shadow-lg scale-[1.02]' : 'bg-gray-800/40 hover:bg-gray-800/60'}
          group flex items-center justify-between
          px-4 py-3 rounded-lg cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${isHovered === index ? 'transform scale-[1.02]' : ''}
        `}
        aria-selected={isSelected}
        role="option"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
            {title.length > 24 ? `${title.slice(0, 24)}...` : title}
          </h3>
          {["movie", "tv"].includes(filterSearches) && year && (
            <span className="text-xs text-gray-400">
              {new Date(year).getFullYear()}
            </span>
          )}
        </div>
        <div className={`
          transform transition-transform duration-300
          ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}
        `}>
          <svg 
            className="w-5 h-5 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
          </svg>
        </div>
      </button>
    );
  };

  const ImageSection = () => {
    if (loading) {
      return (
        <div 
          className="w-11/12 h-full rounded-lg bg-gradient-to-r from-gray-800/40 to-gray-700/40 animate-pulse"
          role="progressbar"
          aria-label="Loading image"
        />
      );
    }

    if (!posterPath && !profilePath) {
      return (
        <div className="h-5/6 w-11/12 rounded-lg bg-gray-800/40 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-24 w-24 text-gray-600 opacity-40">
            <path 
              d="M4 16l4-4 4 4m4-4l4-4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </div>
      );
    }

    return (
      <Link
        href={`/results/${getLinkPath(filterSearches)}/${results[selectedMovie]?.id}`}
        className={`
          group relative h-full w-11/12 overflow-hidden rounded-lg
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}
        aria-label={`View details for ${posterAlt}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
          src={`https://image.tmdb.org/t/p/original${posterPath || profilePath}`}
          alt={posterAlt}
          loading="lazy"
        />
        
        {filterSearches === "person" && results[selectedMovie]?.known_for && (
          <div className="absolute bottom-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-semibold text-white mb-2">Known For:</h3>
            <div className="flex flex-wrap gap-2">
              {results[selectedMovie].known_for.slice(0, 2).map((item, index) => (
                <span
                  key={item.id || index}
                  className="bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
                >
                  {item.title?.length > 30 ? `${item.title.slice(0, 30)}...` : item.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <div 
      className="w-full relative rounded-xl flex shadow-xl border border-gray-700/20 min-h-[342px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950"
      role="listbox"
      aria-label="Search results"
    >
      <div className="w-6/12 h-full flex flex-col z-10 gap-2.5 p-4">
        {results.length > 0 && results[0]?.name !== "" ? (
          results.map((data, index) => (
            loading ? (
              <LoadingPulse key={index} />
            ) : (
              <ResultItem key={index} data={data} index={index} />
            )
          ))
        ) : (
          <NoResults />
        )}
      </div>
      <div className="w-6/12 p-4 h-full z-10 flex items-center justify-center">
        <ImageSection />
      </div>
    </div>
  );
};

export default SearchResults;