"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import fetchData from "@/utils/tmdb";
import "../../app/globals.css";
// Custom hooks
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useIntersectionObserver = (callback, options = {}) => {
  const observer = useRef(null);

  return useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      if (node) {
        observer.current = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) callback();
        }, options);
        observer.current.observe(node);
      }
    },
    [callback, options]
  );
};

// Utility functions
const formatDate = (dateString, format = "long") => {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  return format === "long"
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
};

const formatRuntime = (minutes) => {
  if (!minutes) return "TBA";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const formatCurrency = (amount) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Component: Movie Card
const MovieCard = ({
  movie,
  genres,
  showOverview = false,
  onTrailerClick,
  onMovieSelect,
  size = "normal",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardClasses = {
    small: "aspect-[2/3]",
    normal: "aspect-[2/3]",
    large: "aspect-[16/9]",
  };

  return (
    <div
      className={`
 rounded-lg overflow-hidden bg-gray-800 
 ${size === "large" ? "col-span-2" : ""}
 transform transition-all duration-300
 ${isHovered ? "scale-105 z-10 shadow-xl" : ""}
 `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}
        <img
          src={`https://image.tmdb.org/t/p/${
            size === "large" ? "w780" : "w500"
          }${imageError ? "/placeholder.jpg" : movie.poster_path}`}
          alt={movie.title}
          className={`w-full ${cardClasses[size]} object-cover`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />

        <div
          className={`
 absolute inset-0 bg-gradient-to-t from-black/90 to-transparent 
 opacity-0 group-hover:opacity-100 transition-opacity duration-300
 flex flex-col justify-end p-4
 `}
        >
          {showOverview && (
            <p className="text-sm text-white mb-4 line-clamp-3">
              {movie.overview}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onTrailerClick(movie.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg 
 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Trailer
            </button>

            <button
              onClick={() => onMovieSelect(movie.id)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg 
 text-sm font-semibold"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold truncate flex-1">{movie.title}</h4>
          <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm">{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-2 flex items-center justify-between">
          <span>{formatDate(movie.release_date, "short")}</span>
          {movie.vote_count && (
            <span className="text-xs">
              {movie.vote_count.toLocaleString()} votes
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {movie.genre_ids?.slice(0, 2).map((genreId) => {
            const genre = genres.find((g) => g.id === genreId);
            return genre ? (
              <span
                key={genreId}
                className="text-xs bg-gray-700 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

// Component: Movie Details Modal
const MovieDetailsModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieData, credits, similar] = await Promise.all([
          fetchData(`/movie/${movieId}`),
          fetchData(`/movie/${movieId}/credits`),
          fetchData(`/movie/${movieId}/similar`),
        ]);

        setMovie(movieData);
        setCast(credits.cast.slice(0, 10));
        setCrew(
          credits.crew
            .filter((person) =>
              ["Director", "Writer", "Producer"].includes(person.job)
            )
            .slice(0, 5)
        );
        setSimilarMovies(similar.results.slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/75 transition-opacity" />

        <div className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center gap-4 text-sm">
                <span>{formatDate(movie.release_date)}</span>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span>•</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="text-gray-300 mb-6">{movie.overview}</p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-5 gap-4">
                  {cast.map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="aspect-square rounded-full overflow-hidden mb-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium text-sm truncate">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-4 gap-4">
                  {similarMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setMovie(null);
                        setIsLoading(true);
                        onClose();
                        setTimeout(() => onMovieSelect(movie.id), 100);
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">Movie Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p>{movie.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Budget</p>
                    <p>{formatCurrency(movie.budget)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p>{formatCurrency(movie.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Original Language</p>
                    <p>{movie.original_language?.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Crew</h3>
                <div className="space-y-3">
                  {crew.map((person) => (
                    <div key={`${person.id}-${person.job}`}>
                      <p className="text-gray-400 text-sm">{person.job}</p>
                      <p>{person.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function Home() {
  // State Management
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [view, setView] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("popularity.desc");
  const debouncedSearch = useDebounce(searchQuery);

  // Infinite scroll observer
  const loadMoreRef = useIntersectionObserver(() => {
    if (!isFetching && hasMore) {
      loadMoreMovies();
    }
  });

  // Fetch movie trailer
  const fetchTrailer = async (movieId) => {
    try {
      const data = await fetchData(`/movie/${movieId}/videos`);
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setCurrentTrailer(trailer ? trailer.key : null);
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  // Load more movies
  const loadMoreMovies = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const endpoint = debouncedSearch
        ? "/search/movie"
        : selectedGenre
        ? "/discover/movie"
        : "/movie/popular";

      const params = {
        page: nextPage,
        ...(debouncedSearch && { query: debouncedSearch }),
        ...(selectedGenre && { with_genres: selectedGenre }),
        sort_by: sortBy,
      };

      const data = await fetchData(endpoint, params);
      setPopularMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Initial data fetch
  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [trending, popular, upcoming, topRated, genreList] =
        await Promise.all([
          fetchData("/trending/movie/day"),
          fetchData("/movie/popular", { sort_by: sortBy }),
          fetchData("/movie/upcoming"),
          fetchData("/movie/top_rated"),
          fetchData("/genre/movie/list"),
        ]);

      setTrendingMovies(trending.results.slice(0, 6));
      setPopularMovies(popular.results);
      setUpcomingMovies(upcoming.results.slice(0, 4));
      setTopRatedMovies(topRated.results.slice(0, 4));
      setGenres(genreList.genres);
      setHasMore(popular.page < popular.total_pages);

      // Set featured movie with additional details
      if (trending.results.length > 0) {
        const details = await fetchData(`/movie/${trending.results[0].id}`);
        const trailerData = await fetchData(
          `/movie/${trending.results[0].id}/videos`
        );
        const trailer = trailerData.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setFeaturedMovie({ ...details, trailerKey: trailer?.key });
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load movie data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // Handle search and filters
  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedSearch && !selectedGenre) {
        fetchInitialData();
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        const endpoint = debouncedSearch ? "/search/movie" : "/discover/movie";
        const params = {
          ...(debouncedSearch && { query: debouncedSearch }),
          ...(selectedGenre && { with_genres: selectedGenre }),
          sort_by: sortBy,
        };

        const data = await fetchData(endpoint, params);
        setPopularMovies(data.results);
        setPage(1);
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        setError("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [debouncedSearch, selectedGenre, sortBy]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setCurrentTrailer(null);
        setSelectedMovie(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-400">Loading amazing movies for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchInitialData}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/95 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">
                <span className="text-blue-500">WW</span> Movie Database
              </h1>
              <div className="hidden md:flex items-center gap-6">
                <button
                  className={`hover:text-blue-400 ${
                    !selectedGenre && "text-blue-400"
                  }`}
                  onClick={() => setSelectedGenre(null)}
                >
                  All
                </button>
                <div className="relative group">
                  <button className="hover:text-blue-400">
                    Genres
                    <svg
                      className="w-4 h-4 ml-1 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-2 grid grid-cols-2 gap-2">
                      {genres.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => setSelectedGenre(genre.id)}
                          className={`text-sm px-3 py-2 rounded hover:bg-gray-700 text-left
 ${selectedGenre === genre.id ? "bg-blue-600" : ""}`}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className={`hover:text-blue-400 ${
                    sortBy === "vote_average.desc" && "text-blue-400"
                  }`}
                  onClick={() => setSortBy("vote_average.desc")}
                >
                  Top Rated
                </button>
                <button
                  className={`hover:text-blue-400 ${
                    sortBy === "release_date.desc" && "text-blue-400"
                  }`}
                  onClick={() => setSortBy("release_date.desc")}
                >
                  Latest
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                className="p-2 hover:bg-gray-800 rounded-lg"
                title={`Switch to ${view === "grid" ? "list" : "grid"} view`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {view === "grid" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 6h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1zm0 6h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="pt-16 relative min-h-[80vh] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 1)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <h2 className="text-5xl font-bold mb-4">{featuredMovie.title}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-yellow-400 text-lg">
                  ★ {featuredMovie.vote_average?.toFixed(1)}
                </span>
                <span>|</span>
                <span>{formatDate(featuredMovie.release_date)}</span>
                <span>|</span>
                <span>{formatRuntime(featuredMovie.runtime)}</span>
              </div>
              <p className="text-xl mb-6">{featuredMovie.overview}</p>
              <div className="flex flex-wrap gap-4 mb-8">
                {featuredMovie.genres?.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
              <div className="flex space-x-4">
                {featuredMovie.trailerKey && (
                  <button
                    onClick={() => setCurrentTrailer(featuredMovie.trailerKey)}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold 
 flex items-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Watch Trailer</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedMovie(featuredMovie.id)}
                  className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold"
                >
                  More Info
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="sticky top-16 bg-gray-900 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for movies, actors, or genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 
 focus:outline-none focus:border-blue-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isSearching ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : debouncedSearch || selectedGenre ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {debouncedSearch
                  ? `Search Results for "${debouncedSearch}"`
                  : `${
                      genres.find((g) => g.id === selectedGenre)?.name
                    } Movies`}
              </h2>
              <p className="text-gray-400">
                {popularMovies.length} results found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genres={genres}
                  onTrailerClick={fetchTrailer}
                  onMovieSelect={setSelectedMovie}
                  size={view === "list" ? "small" : "normal"}
                />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-10" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genres={genres}
                  onTrailerClick={fetchTrailer}
                  onMovieSelect={setSelectedMovie}
                  size={view === "list" ? "small" : "normal"}
                />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-10" />
          </>
        )}
      </main>

      {/* Trailer Modal */}
      {currentTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="relative w-full max-w-2xl aspect-video">
            <button
              onClick={() => setCurrentTrailer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${currentTrailer}`}
              title={featuredMovie?.title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movieId={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
