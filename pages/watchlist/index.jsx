import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Heart,
  ChevronLeft,
  Film,
  Tv,
  Trash2,
  AlertCircle,
} from "lucide-react";
import MediaCard from "@/components/MediaCard";
import { useWatchlist } from "@/contexts/WatchlistContext";
import "../../app/globals.css";

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once the component is mounted
    setIsLoading(false);
  }, []);

  const handleRemoveItem = (itemId, mediaType) => {
    removeFromWatchlist(itemId, mediaType);
  };

  const clearWatchlist = () => {
    // Remove all items one by one
    watchlist.forEach((item) => {
      removeFromWatchlist(item.id, item.media_type);
    });
  };

  const filteredItems =
    activeFilter === "all"
      ? watchlist
      : watchlist.filter((item) => item.media_type === activeFilter);

  const movieCount = watchlist.filter(
    (item) => item.media_type === "movie"
  ).length;
  const tvCount = watchlist.filter((item) => item.media_type === "tv").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-white/20 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">Watchlist</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              My Watchlist
            </h1>

            {watchlist.length > 0 && (
              <button
                onClick={clearWatchlist}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors self-start md:self-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {watchlist.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                activeFilter === "all"
                  ? "bg-white text-black font-medium"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span>All ({watchlist.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("movie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                activeFilter === "movie"
                  ? "bg-white text-black font-medium"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies ({movieCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter("tv")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                activeFilter === "tv"
                  ? "bg-white text-black font-medium"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>TV Shows ({tvCount})</span>
            </button>
          </div>
        )}

        {/* Watchlist items */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div
                key={`${item.id}-${item.media_type}`}
                className="relative group"
              >
                <MediaCard item={item} type={item.media_type} />
                <button
                  onClick={() => handleRemoveItem(item.id, item.media_type)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white/10 p-6 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-white/70 max-w-md mb-6">
              Add movies and TV shows to your watchlist to keep track of what
              you want to watch
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg">
                Browse Content
              </button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WatchlistPage;
