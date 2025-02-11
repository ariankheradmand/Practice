import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import fetchData from "../../../../utils/tmdb";
import { Clock, Flag, Star, Calendar, Share2 } from "lucide-react";
import "../../../../app/globals.css"
const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      try {
        const data = await fetchData(`/movie/${movieId}?language=en-US`);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="text-white text-xl">Movie not found</div>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="relative animate-fadeIn">
        {/* Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isImageLoaded ? "opacity-30" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Poster Section */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              </div>

              {/* Rating and Share Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">
                    {movie.vote_average?.toFixed(1)} / 10
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowShareTooltip(!showShareTooltip)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Share movie"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  {showShareTooltip && (
                    <div className="absolute right-0 mt-2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm">
                      Share this movie
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-2/3 text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-white/70 italic">
                    {movie.tagline}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={movie.release_date}>
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Flag className="w-4 h-4" />
                  <span className="uppercase">{movie.original_language}</span>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-white/90">
                {movie.overview}
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 text-sm cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;
