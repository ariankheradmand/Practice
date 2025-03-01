import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import fetchData from "../../../../utils/tmdb";
import Link from "next/link";
import {
  Film,
  Filter,
  ChevronLeft,
  Grid,
  List,
  ArrowDownAZ,
  Star,
  Calendar,
} from "lucide-react";
import "../../../../app/globals.css";

const MovieGenrePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [viewMode, setViewMode] = useState("grid");
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchGenreDetails = async () => {
      setLoading(true);
      try {
        // Fetch genre details
        const genresData = await fetchData("/genre/movie/list");
        const currentGenre = genresData.genres.find(
          (g) => g.id.toString() === id.toString()
        );
        setGenre(currentGenre);

        // Fetch movies for this genre
        const moviesData = await fetchData(
          `/discover/movie?with_genres=${id}&sort_by=${sortBy}&page=${page}`
        );
        setMovies(moviesData.results || []);
        setTotalPages(
          moviesData.total_pages > 500 ? 500 : moviesData.total_pages
        );
      } catch (error) {
        console.error("Failed to fetch genre data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreDetails();
  }, [id, page, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortOptions(false);
    setPage(1); // Reset to first page when sort changes
  };

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity", icon: Star },
    { value: "vote_average.desc", label: "Rating", icon: Star },
    { value: "release_date.desc", label: "Newest", icon: Calendar },
    { value: "release_date.asc", label: "Oldest", icon: Calendar },
    { value: "original_title.asc", label: "A-Z", icon: ArrowDownAZ },
  ];

  if (loading && !movies.length) {
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
            <Link href="/genres" className="hover:text-white transition-colors">
              Genres
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">{genre?.name || "Loading..."}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              {genre?.name || "Loading..."} Movies
            </h1>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/5 rounded-lg">
                <button
                  className={`p-2 rounded-l-lg ${
                    viewMode === "grid" ? "bg-white/20" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-5 h-5 text-white" />
                </button>
                <button
                  className={`p-2 rounded-r-lg ${
                    viewMode === "list" ? "bg-white/20" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setShowSortOptions(!showSortOptions)}
                >
                  <Filter className="w-4 h-4 text-white" />
                  <span className="text-white">Sort</span>
                </button>

                {showSortOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition-colors ${
                          sortBy === option.value
                            ? "bg-white/20 text-white"
                            : "text-white/80"
                        }`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/70">
            <Film className="w-16 h-16 mb-4 text-white/30" />
            <p className="text-xl">No movies found for this genre</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MediaCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {movies.map((movie) => (
              <Link
                href={`/results/movie/${movie.id}`}
                key={movie.id}
                className="flex gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4"
              >
                <div className="w-20 h-30 flex-shrink-0">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                        : "https://via.placeholder.com/154x231?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-auto rounded-md object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/154x231?text=No+Image";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-white/60 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {movie.overview}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1 px-4">
              <span className="text-white/70">Page</span>
              <span className="font-medium text-white">{page}</span>
              <span className="text-white/70">of</span>
              <span className="font-medium text-white">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MovieGenrePage;
