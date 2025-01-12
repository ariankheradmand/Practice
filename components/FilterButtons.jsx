import React from "react";

const FilterButtons = ({
  collection,
  filterSearches,
  setFilterSearches,
  openSearchBar,
  endOfPage,
}) => {
  return (
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
              className={`${filterSearches === data ? "bg-black/50" : "bg-black/30"} py-1 px-2`}
            >
              {data}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
