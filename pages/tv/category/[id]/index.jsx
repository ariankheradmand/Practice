import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import fetchData from "../../../../utils/tmdb";
import Link from "next/link";
import {
  Tv,
  Filter,
  ChevronLeft,
  Grid,
  List,
  ArrowDownAZ,
  Star,
  Calendar,
} from "lucide-react";
import "../../../../app/globals.css";

const TVCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [viewMode, setViewMode] = useState("grid");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCategoryTVShows = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        let title = "";

        // Map category ID to appropriate endpoint and title
        switch (id) {
          case "popular":
            endpoint = `/tv/popular?page=${page}`;
            title = "Popular TV Shows";
            break;
          case "top_rated":
            endpoint = `/tv/top_rated?page=${page}`;
            title = "Top Rated TV Shows";
            break;
          case "on_the_air":
            endpoint = `/tv/on_the_air?page=${page}`;
            title = "Currently Airing TV Shows";
            break;
          case "airing_today":
            endpoint = `/tv/airing_today?page=${page}`;
            title = "TV Shows Airing Today";
            break;
          default:
            // For custom categories or collections
            if (id.startsWith("custom_")) {
              const customEndpoint = id.replace("custom_", "");
              endpoint = `/discover/tv?${customEndpoint}&page=${page}&sort_by=${sortBy}`;
              title = customEndpoint
                .split("=")[1]
                .split("&")[0]
                .replace(/_/g, " ");
              title =
                title.charAt(0).toUpperCase() + title.slice(1) + " TV Shows";
            } else {
              endpoint = `/discover/tv?${id}&page=${page}&sort_by=${sortBy}`;
              // Extract a title from the endpoint
              const extractedParam = id.split("=")[0];
              title =
                extractedParam.replace(/_/g, " ").charAt(0).toUpperCase() +
                extractedParam.slice(1).replace(/_/g, " ") +
                " TV Shows";
            }
        }

        setCategoryTitle(title);
        const showsData = await fetchData(endpoint);
        setShows(showsData.results || []);
        setTotalPages(
          showsData.total_pages > 500 ? 500 : showsData.total_pages
        );
      } catch (error) {
        console.error("Failed to fetch category TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTVShows();
  }, [id, page, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortOptions(false);
    setPage(1); // Reset to first page when sort changes
  };

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity", icon: Star },
    { value: "vote_average.desc", label: "Rating", icon: Star },
    { value: "first_air_date.desc", label: "Newest", icon: Calendar },
    { value: "first_air_date.asc", label: "Oldest", icon: Calendar },
    { value: "name.asc", label: "A-Z", icon: ArrowDownAZ },
  ];

  if (loading && !shows.length) {
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
            <Link href="/tv" className="hover:text-white transition-colors">
              TV Shows
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">{categoryTitle}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                <Tv className="w-6 h-6 text-white" />
              </div>
              {categoryTitle}
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

        {/* TV Shows Grid */}
        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/70">
            <Tv className="w-16 h-16 mb-4 text-white/30" />
            <p className="text-xl">No TV shows found for this category</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {shows.map((show) => (
              <MediaCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {shows.map((show) => (
              <Link
                href={`/results/tv/${show.id}`}
                key={show.id}
                className="flex gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4"
              >
                <div className="w-20 h-30 flex-shrink-0">
                  <img
                    src={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w154${show.poster_path}`
                        : "https://via.placeholder.com/154x231?text=No+Image"
                    }
                    alt={show.name}
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
                    {show.name}
                  </h3>
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">
                        {show.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-white/60 text-sm">
                      {show.first_air_date
                        ? new Date(show.first_air_date).getFullYear()
                        : "Unknown"}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {show.overview}
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

export default TVCategoryPage;
