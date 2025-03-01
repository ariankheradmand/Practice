import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  PlayCircle,
  Calendar,
  Clock,
  Info,
  Heart,
  Clapperboard,
  Bomb,
  Compass,
  PaintBucket,
  Laugh,
  ShieldAlert,
  FileText,
  Drama,
  Users,
  Wand2,
  Scroll,
  Skull,
  Music,
  Search,
  Heart as HeartIcon,
  Rocket,
  Tv,
  Timer,
  Swords,
  Mountain,
  Tag,
} from "lucide-react";
import fetchData from "../utils/tmdb";

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const GENRE_ICONS = {
  28: Bomb,
  12: Compass,
  16: PaintBucket,
  35: Laugh,
  80: ShieldAlert,
  99: FileText,
  18: Drama,
  10751: Users,
  14: Wand2,
  36: Scroll,
  27: Skull,
  10402: Music,
  9648: Search,
  10749: HeartIcon,
  878: Rocket,
  10770: Tv,
  53: Timer,
  10752: Swords,
  37: Mountain,
};

export default function Hero() {
  const router = useRouter();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState(new Set());

  // Load watchlist initially and setup event listeners for changes
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const savedWatchlist = localStorage.getItem("watchlist");
        if (savedWatchlist) {
          const watchlist = JSON.parse(savedWatchlist);
          const movieIds = new Set(
            watchlist
              .filter((item) => item.media_type === "movie")
              .map((item) => item.id)
          );
          setLikedMovies(movieIds);
        } else {
          setLikedMovies(new Set());
        }
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        setLikedMovies(new Set());
      }
    };

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "watchlist") {
        loadWatchlist();
      }
    };

    loadWatchlist();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData("/movie/popular", {
          language: "en-US",
          page: 1,
        });

        // Process and enhance movie data
        const enhancedMovies = data.results.slice(0, 5).map((movie) => ({
          ...movie,
          genres: movie.genre_ids
            .slice(0, 3)
            .map((genreId) => ({
              id: genreId,
              name: GENRE_MAP[genreId] || "Unknown",
            }))
            .filter(Boolean),
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A",
        }));

        setFeaturedMovies(enhancedMovies);
      } catch (error) {
        console.error("Error fetching featured movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovies();

    // Auto-rotate featured movies
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleLike = (movieId) => {
    try {
      // Get current watchlist
      const savedWatchlist = localStorage.getItem("watchlist");
      let watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];

      if (likedMovies.has(movieId)) {
        // Remove from watchlist
        watchlist = watchlist.filter(
          (item) => !(item.id === movieId && item.media_type === "movie")
        );
        setLikedMovies((prev) => {
          const newLiked = new Set(prev);
          newLiked.delete(movieId);
          return newLiked;
        });
      } else {
        // Find the current movie
        const movie = featuredMovies.find((m) => m.id === movieId);
        if (movie) {
          // Add to watchlist
          watchlist.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            media_type: "movie",
          });
          setLikedMovies((prev) => {
            const newLiked = new Set(prev);
            newLiked.add(movieId);
            return newLiked;
          });
        }
      }

      // Save to localStorage
      localStorage.setItem("watchlist", JSON.stringify(watchlist));

      // Dispatch storage event for other components to detect the change
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  if (isLoading || featuredMovies.length === 0) {
    return (
      <div className="relative w-full h-[70vh] bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Clapperboard className="w-16 h-16 text-white/30 mb-4" />
          <div className="h-8 w-64 bg-white/10 rounded-md"></div>
        </div>
      </div>
    );
  }

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="relative w-full h-[70vh] overflow-hidden mt-2 pt-20">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-all duration-700 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-600/90 text-white text-xs font-medium rounded-full">
              Featured
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {currentMovie.vote_average.toFixed(1)} Rating
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {currentMovie.year}
            </span>
            {currentMovie.genres &&
              currentMovie.genres.map((genre) => {
                const GenreIcon = GENRE_ICONS[genre.id] || Tag;
                return (
                  <Link href={`/movies/genre/${genre.id}`} key={genre.id}>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1">
                      <GenreIcon className="w-3 h-3" />
                      {genre.name}
                    </span>
                  </Link>
                );
              })}
          </div>

          {/* Title and Overview */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {currentMovie.title}
          </h1>
          <p className="text-lg text-white/80 mb-8 line-clamp-3">
            {currentMovie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href={`/results/movie/${currentMovie.id}`}>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg transition-all">
                <PlayCircle className="w-5 h-5" />
                Watch Now
              </button>
            </Link>
            <Link href={`/results/movie/${currentMovie.id}`}>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all">
                <Info className="w-5 h-5" />
                More Info
              </button>
            </Link>
            <button
              className={`p-3 ${
                likedMovies.has(currentMovie.id)
                  ? "bg-pink-600/80"
                  : "bg-white/10"
              } hover:bg-white/20 text-white rounded-lg flex items-center backdrop-blur-sm transition-all`}
              onClick={() => toggleLike(currentMovie.id)}
            >
              <Heart
                className={`w-5 h-5 ${
                  likedMovies.has(currentMovie.id) ? "fill-current" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 scale-110"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
