import React, { useState } from "react";
import Link from "next/link";
import { Star, PlayCircle, Info, Heart } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";

const MediaCard = ({ item, type = "movie" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Determine the media type for API consistency
  const mediaType = type === "tv" ? "tv" : "movie";

  // Determine the detail page URL based on type
  const detailUrl =
    type === "tv" ? `/results/tv/${item.id}` : `/results/movie/${item.id}`;

  // Check if this item is in the watchlist
  const itemInWatchlist = isInWatchlist(item.id, mediaType);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Make sure item has the required properties for the watchlist
    const watchlistItem = {
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date,
      media_type: mediaType,
    };

    if (itemInWatchlist) {
      removeFromWatchlist(item.id, mediaType);
    } else {
      addToWatchlist(watchlistItem);
    }
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            item.poster_path || "/placeholder.jpg"
          }`}
          alt={item.title || item.name}
          className={`w-full h-full object-cover transform transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/500x750?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Watchlist Button */}
        <button
          onClick={toggleWatchlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-800"
          aria-label={
            itemInWatchlist ? "Remove from watchlist" : "Add to watchlist"
          }
        >
          <Heart
            className={`w-4 h-4 ${
              itemInWatchlist ? "fill-pink-500 text-pink-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/90 p-1 rounded text-xs font-bold text-white flex items-center">
              <Star className="w-3 h-3 mr-0.5" strokeWidth={2} />
              {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
            </div>
            {item.release_date && (
              <div className="bg-white/10 p-1 rounded text-xs font-medium text-white/90">
                {new Date(item.release_date).getFullYear()}
              </div>
            )}
            {item.first_air_date && (
              <div className="bg-white/10 p-1 rounded text-xs font-medium text-white/90">
                {new Date(item.first_air_date).getFullYear()}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {item.title || item.name}
          </h3>
          <div className="flex items-center gap-2">
            <Link href={detailUrl}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm">
                <PlayCircle className="w-4 h-4 text-white" />
                <span>Watch</span>
              </button>
            </Link>
            <Link href={detailUrl}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm">
                <Info className="w-4 h-4 text-white" />
                <span>Info</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
