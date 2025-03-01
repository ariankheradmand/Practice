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
      className={`${
        openSearchBar ? "visible" : "invisible"
      } flex items-center justify-center gap-3 w-full max-w-md mx-auto mb-6`}
    >
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setFilterSearches(id)}
          className={`
            relative group flex items-center gap-2 px-4 py-2.5 rounded-xl
            transition-all duration-300 ease-out flex-1
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
          <div className="relative flex items-center gap-2">
            <Icon
              className={`
                w-5 h-5 transition-colors duration-300
                ${
                  filterSearches === id
                    ? "text-purple-400"
                    : "text-gray-400 group-hover:text-gray-300"
                }
              `}
            />
            <span
              className={`
                text-sm font-medium transition-colors duration-300
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
