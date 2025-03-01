import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import fetchData from "../../utils/tmdb";
import Link from "next/link";
import {
  Film,
  Tv,
  ChevronLeft,
  Sparkles,
  Ticket,
  // Add genre-specific icons
  Bomb, // Action
  Compass, // Adventure
  PaintBucket, // Animation
  Laugh, // Comedy
  ShieldAlert, // Crime
  FileText, // Documentary
  Drama, // Drama
  Users, // Family
  Wand2, // Fantasy
  Scroll, // History
  Skull, // Horror
  Music, // Music
  Search, // Mystery
  Heart, // Romance
  Rocket, // Science Fiction
  Clapperboard, // TV Movie
  Timer, // Thriller
  Swords, // War
  Mountain, // Western
  Radio, // News
  Baby, // Kids
  Star, // Reality
  MessageCircle, // Talk
  Briefcase, // War & Politics
  Tv2, // Soap
} from "lucide-react";
import "../../app/globals.css";

const GenresPage = () => {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movies");

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          fetchData("/genre/movie/list"),
          fetchData("/genre/tv/list"),
        ]);

        setMovieGenres(movieGenresData.genres || []);
        setTvGenres(tvGenresData.genres || []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Color mapping for genres to make page visually interesting
  const colorMap = {
    28: "from-red-500 to-orange-500", // Action
    12: "from-blue-500 to-teal-500", // Adventure
    16: "from-purple-500 to-pink-500", // Animation
    35: "from-yellow-500 to-amber-500", // Comedy
    80: "from-gray-600 to-gray-800", // Crime
    99: "from-emerald-500 to-green-500", // Documentary
    18: "from-blue-600 to-indigo-600", // Drama
    10751: "from-yellow-400 to-orange-400", // Family
    14: "from-violet-500 to-purple-600", // Fantasy
    36: "from-amber-700 to-yellow-800", // History
    27: "from-red-800 to-red-950", // Horror
    10402: "from-pink-400 to-rose-500", // Music
    9648: "from-slate-700 to-slate-900", // Mystery
    10749: "from-pink-400 to-red-400", // Romance
    878: "from-indigo-500 to-blue-600", // Science Fiction
    10770: "from-gray-500 to-slate-600", // TV Movie
    53: "from-amber-600 to-red-700", // Thriller
    10752: "from-green-700 to-green-900", // War
    37: "from-amber-800 to-yellow-900", // Western
    // TV specific genres
    10759: "from-orange-500 to-red-500", // Action & Adventure (TV)
    10762: "from-pink-300 to-pink-500", // Kids
    10763: "from-cyan-600 to-blue-600", // News
    10764: "from-purple-400 to-indigo-500", // Reality
    10765: "from-violet-600 to-indigo-700", // Sci-Fi & Fantasy
    10766: "from-pink-400 to-purple-400", // Soap
    10767: "from-amber-400 to-yellow-500", // Talk
    10768: "from-blue-600 to-indigo-800", // War & Politics
  };

  // Default color for genres without a specific mapping
  const getGenreColor = (genreId) => {
    return colorMap[genreId] || "from-gray-500 to-gray-700";
  };

  // Function to get appropriate icon based on genre ID
  const getGenreIcon = (genreId) => {
    const iconMap = {
      // Movie genres
      28: Bomb, // Action
      12: Compass, // Adventure
      16: PaintBucket, // Animation
      35: Laugh, // Comedy
      80: ShieldAlert, // Crime
      99: FileText, // Documentary
      18: Drama, // Drama
      10751: Users, // Family
      14: Wand2, // Fantasy
      36: Scroll, // History
      27: Skull, // Horror
      10402: Music, // Music
      9648: Search, // Mystery
      10749: Heart, // Romance
      878: Rocket, // Science Fiction
      10770: Clapperboard, // TV Movie
      53: Timer, // Thriller
      10752: Swords, // War
      37: Mountain, // Western

      // TV specific genres
      10759: Bomb, // Action & Adventure (TV)
      10762: Baby, // Kids
      10763: Radio, // News
      10764: Star, // Reality
      10765: Rocket, // Sci-Fi & Fantasy
      10766: Tv2, // Soap
      10767: MessageCircle, // Talk
      10768: Briefcase, // War & Politics
    };

    return iconMap[genreId] || Sparkles;
  };

  if (loading) {
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
            <span className="text-white">Genres</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            Browse by Genre
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("movies")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors ${
              activeTab === "movies"
                ? "bg-white text-black font-medium"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Film className="w-5 h-5" />
            <span>Movie Genres</span>
          </button>
          <button
            onClick={() => setActiveTab("tv")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors ${
              activeTab === "tv"
                ? "bg-white text-black font-medium"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Tv className="w-5 h-5" />
            <span>TV Show Genres</span>
          </button>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(activeTab === "movies" ? movieGenres : tvGenres).map((genre) => {
            const GenreIcon = getGenreIcon(genre.id);
            return (
              <Link
                key={genre.id}
                href={
                  activeTab === "movies"
                    ? `/movies/genre/${genre.id}`
                    : `/tv/genre/${genre.id}`
                }
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${getGenreColor(
                    genre.id
                  )} rounded-xl overflow-hidden aspect-[3/2] shadow-lg transform hover:scale-[1.03] transition-all duration-300`}
                >
                  <div className="w-full h-full flex items-center justify-center p-4 text-center bg-black/20 hover:bg-black/10 transition-colors">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-full">
                        <GenreIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-medium text-lg">
                        {genre.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Genres Message */}
        {((activeTab === "movies" && movieGenres.length === 0) ||
          (activeTab === "tv" && tvGenres.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-16 text-white/70">
            <Ticket className="w-16 h-16 mb-4 text-white/30" />
            <p className="text-xl">No genres found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GenresPage;
