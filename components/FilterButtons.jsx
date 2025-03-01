import React from "react";
import { Film, Tv, Users } from "lucide-react";

const FilterButtons = ({
  collection,
  filterSearches,
  setFilterSearches,
  openSearchBar,
  endOfPage,
}) => {
  const filters = [
    { id: "movie", label: "Movies", icon: Film },
    { id: "tv", label: "TV Shows", icon: Tv },
    { id: "person", label: "People", icon: Users },
  ];

  return (
    <div
      className={`
        flex items-center justify-between gap-1 w-full 
        mx-auto py-1.5 px-1.5
        overflow-x-auto
      `}
    >
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setFilterSearches(id)}
          className={`
            relative group flex items-center justify-center gap-1 sm:gap-2 
            px-3 sm:px-4 py-2 rounded-xl
            transition-all duration-300 ease-out 
            flex-1 min-w-0 whitespace-nowrap
            ${
              filterSearches === id
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg"
                : "hover:bg-white/5"
            }
          `}
        >
          {/* Gradient Border */}
          <div
            className={`
            absolute inset-0 rounded-xl
            transition-opacity duration-300
            ${
              filterSearches === id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"
                : "opacity-0 group-hover:opacity-10"
            }
          `}
          />

          {/* Content */}
          <div className="relative flex items-center gap-1 sm:gap-2">
            <Icon
              className={`
                w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 flex-shrink-0
                ${
                  filterSearches === id
                    ? "text-purple-400"
                    : "text-gray-400 group-hover:text-gray-300"
                }
              `}
            />
            <span
              className={`
                text-xs sm:text-sm font-medium transition-colors duration-300 truncate
                ${
                  filterSearches === id
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-300"
                }
              `}
            >
              {label}
            </span>
          </div>

          {/* Active Indicator */}
          {filterSearches === id && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
