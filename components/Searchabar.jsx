import Image from "next/image";
import React, { useEffect, useState } from "react";

const collection = ["movie", "tv", "person"];

function Searchabar({ openSearchBar, endOfPage }) {
  const [animationWidth, setAnimationWidth] = useState(0);
  const [closingAnimationWidth, setClosingAnimationWidth] = useState(true);

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
          return prev + 5; // Increase by 5 pixels each step
        });
      }, 20); // 30ms for smooth animation
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

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-11/12 flex flex-col items-center justify-center">
        <input
          placeholder="Search"
          style={{ width: `${animationWidth}px` }}
          className={`${
            closingAnimationWidth ? "visible" : "invisible"
          } bg-white/20 text-white placeholder:text-white/60 font-thin h-[24px] pl-1 rounded-md transition-all`}
        />
        <div
          className={`${
            openSearchBar ? "visible" : "invisible"
          } flex items-center justify-start relative  text-white gap-2  w-[160px] left-0`}
        >
          <div
            className={`absolute ${
              endOfPage
                ? "left-0 -top-[70px] rounded-t-md border-x-2 border-t-2"
                : "left-0 top-3 rounded-b-md border-x-2 border-b-2"
            } bg-white/50 backdrop-blur-md w-full flex justify-between`}
          >
            {collection.map((data, index) => (
              <div className="relative" key={index}>
                <button className="bg-black/30 py-1 px-2">{data}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Searchabar;
