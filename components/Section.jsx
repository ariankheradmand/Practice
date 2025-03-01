import React from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";

const Section = ({ title, icon: Icon, color, items, type, sectionId }) => {
  // Add safety check to ensure items is an array
  const safeItems = Array.isArray(items) ? items : [];

  // Create view all link based on the section type and ID
  const getViewAllLink = () => {
    // For TV shows
    if (type === "tv") {
      if (
        ["popular", "top_rated", "on_the_air", "airing_today"].includes(
          sectionId
        )
      ) {
        return `/tv/category/${sectionId}`;
      } else if (sectionId.startsWith("custom_")) {
        return `/tv/category/${sectionId}`;
      }
      return `/tv/category/popular`;
    }

    // For movies
    if (
      ["trending", "top_rated", "upcoming", "now_playing", "popular"].includes(
        sectionId
      )
    ) {
      return `/movies/category/${sectionId}`;
    } else if (sectionId.startsWith("custom_")) {
      return `/movies/category/${sectionId}`;
    }

    return `/movies/category/popular`;
  };

  const viewAllLink = getViewAllLink();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-r ${color} p-2 rounded-lg shadow-md`}>
            {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2} />}
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <Link href={viewAllLink}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-sm text-gray-300">View All</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {safeItems
          .slice(0, 6)
          .map((item) =>
            item && item.id ? (
              <MediaCard key={item.id} item={item} type={type} />
            ) : null
          )}
      </div>
    </div>
  );
};

export default Section;
