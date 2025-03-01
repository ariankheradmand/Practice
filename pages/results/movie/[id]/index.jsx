import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import MediaCard from "@/components/MediaCard";
import fetchData from "../../../../utils/tmdb";
import { useWatchlist } from "@/contexts/WatchlistContext";
import {
  Clock,
  Flag,
  Star,
  Calendar,
  Share2,
  Play,
  Image,
  Film,
  Tag,
  Video,
  Users,
  MonitorPlay,
  Heart,
  Info,
} from "lucide-react";
import Link from "next/link";
import "../../../../app/globals.css";

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [images, setImages] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState("cast");
  const [liked, setLiked] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = movie ? isInWatchlist(movie.id, "movie") : false;

  useEffect(() => {
    const fetchAllMovieData = async (movieId) => {
      try {
        const [
          movieData,
          creditsData,
          videosData,
          imagesData,
          similarData,
          recommendationsData,
          keywordsData,
          watchProvidersData,
        ] = await Promise.all([
          fetchData(`/movie/${movieId}?language=en-US`),
          fetchData(`/movie/${movieId}/credits`),
          fetchData(`/movie/${movieId}/videos`),
          fetchData(`/movie/${movieId}/images`),
          fetchData(`/movie/${movieId}/similar`),
          fetchData(`/movie/${movieId}/recommendations`),
          fetchData(`/movie/${movieId}/keywords`),
          fetchData(`/movie/${movieId}/watch/providers`),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
        setImages(imagesData);
        setSimilar(similarData);
        setRecommendations(recommendationsData);
        setKeywords(keywordsData);
        setWatchProviders(watchProvidersData);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllMovieData(id);
    }
  }, [id]);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const toggleWatchlist = () => {
    if (!movie) return;

    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      const watchlistItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        media_type: "movie",
      };
      addToWatchlist(watchlistItem);
    }
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

  const TabButton = ({ icon: Icon, label, tabName }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        activeTab === tabName ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const TabContent = () => {
    switch (activeTab) {
      case "cast":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {credits?.cast?.slice(0, 12).map((person) => (
              <Link
                href={`/results/person/${person.id}`}
                key={person.id}
                className="bg-white/10 rounded-lg p-2 text-center hover:bg-white/15 transition-colors"
              >
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt={person.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/185x278?text=No+Image")
                  }
                />
                <div className="text-sm font-medium">{person.name}</div>
                <div className="text-xs text-white/70">{person.character}</div>
              </Link>
            ))}
          </div>
        );
      case "videos":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos?.results?.slice(0, 4).map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors"
              >
                <div className="aspect-video bg-black/50 rounded-lg mb-2 flex items-center justify-center relative group">
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    alt={video.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/70 transition-colors rounded-lg">
                    <Play className="w-12 h-12 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="text-sm font-medium">{video.name}</div>
                <div className="text-xs text-white/70">{video.type}</div>
              </a>
            ))}
          </div>
        );
      case "images":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.backdrops?.slice(0, 8).map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt={`Movie still ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        );
      case "similar":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar?.results?.slice(0, 6).map((movie) => (
              <MediaCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        );
      case "watch":
        return (
          <div className="space-y-4">
            {watchProviders?.results?.US?.flatrate && (
              <div>
                <h3 className="text-lg font-medium mb-2">Stream</h3>
                <div className="flex flex-wrap gap-4">
                  {watchProviders.results.US.flatrate.map((provider) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 hover:bg-white/15 transition-colors"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {watchProviders?.results?.US?.rent && (
              <div>
                <h3 className="text-lg font-medium mb-2">Rent</h3>
                <div className="flex flex-wrap gap-4">
                  {watchProviders.results.US.rent.map((provider) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 hover:bg-white/15 transition-colors"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {watchProviders?.results?.US?.buy && (
              <div>
                <h3 className="text-lg font-medium mb-2">Buy</h3>
                <div className="flex flex-wrap gap-4">
                  {watchProviders.results.US.buy.map((provider) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 hover:bg-white/15 transition-colors"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!watchProviders?.results?.US?.flatrate &&
              !watchProviders?.results?.US?.rent &&
              !watchProviders?.results?.US?.buy && (
                <div className="text-center py-8 text-white/70">
                  No streaming information available for this region.
                </div>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="relative animate-fadeIn">
        {/* Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : "https://via.placeholder.com/1920x1080?text=No+Image"
            }
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isImageLoaded ? "opacity-30" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/1920x1080?text=No+Image";
              setIsImageLoaded(true);
            }}
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
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/500x750?text=No+Image";
                  }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              </div>

              {/* Actions and Ratings */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">
                      {movie.vote_average?.toFixed(1)} / 10
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full transition-colors ${
                        liked
                          ? "bg-red-500/20 text-red-500"
                          : "hover:bg-white/10 text-white"
                      }`}
                      aria-label="Like movie"
                    >
                      <Heart
                        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                      />
                    </button>

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

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {videos?.results?.find((v) => v.type === "Trailer") && (
                    <a
                      href={`https://www.youtube.com/watch?v=${
                        videos.results.find((v) => v.type === "Trailer").key
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white transition-colors text-black font-medium rounded-full py-3 px-6"
                    >
                      <Play className="w-5 h-5" fill="black" />
                      Watch Trailer
                    </a>
                  )}

                  {watchProviders?.results?.US?.flatrate && (
                    <a
                      href={watchProviders.results.US.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white font-medium rounded-full py-3 px-6"
                    >
                      <MonitorPlay className="w-5 h-5" />
                      Where to Watch
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <Link href={`/movie/${id}/watch`}>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Play className="w-5 h-5" />
                      <span>Watch Now</span>
                    </button>
                  </Link>
                  <button
                    onClick={toggleWatchlist}
                    className={`flex items-center gap-2 px-6 py-3 ${
                      inWatchlist
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-white/10 hover:bg-white/20"
                    } text-white rounded-lg transition-colors`}
                  >
                    <Heart
                      className={`w-5 h-5 ${inWatchlist ? "fill-white" : ""}`}
                    />
                    <span>
                      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowShareTooltip(!showShareTooltip)}
                    className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    {showShareTooltip && (
                      <div className="absolute right-0 mt-2 p-2 bg-gray-800 rounded-lg shadow-lg z-10 whitespace-nowrap">
                        Copy link to share
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Keywords */}
              {keywords?.keywords?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.keywords.map((keyword) => (
                      <span
                        key={keyword.id}
                        className="bg-white/10 hover:bg-white/15 transition-colors rounded-full px-3 py-1 text-sm text-white cursor-pointer"
                      >
                        {keyword.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                    <Link
                      key={genre.id}
                      href={`/movies/genre/${genre.id}`}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 text-sm cursor-pointer"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 text-white">
                  <TabButton icon={Users} label="Cast" tabName="cast" />
                  <TabButton icon={Video} label="Videos" tabName="videos" />
                  <TabButton icon={Image} label="Images" tabName="images" />
                  <TabButton icon={Film} label="Similar" tabName="similar" />
                  <TabButton icon={MonitorPlay} label="Watch" tabName="watch" />
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                  <TabContent />
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

      {/* Recommendations Section */}
      {recommendations?.results?.length > 0 && (
        <div className="bg-black/80 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Section
              title="Recommended Movies"
              icon={Film}
              color="from-blue-500 to-purple-500"
              items={recommendations.results}
              type="movie"
              sectionId="recommendations"
            />
          </div>
        </div>
      )}

      {/* Production Companies */}
      {movie.production_companies?.length > 0 && (
        <div className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">
              Production Companies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {movie.production_companies.map(
                (company) =>
                  company.logo_path && (
                    <div
                      key={company.id}
                      className="bg-white/5 rounded-lg p-4 flex items-center justify-center transition-all hover:bg-white/10"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="max-h-16 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crew Section */}
      {credits?.crew?.length > 0 && (
        <div className="bg-black/90 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Key Crew</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {credits.crew
                .filter((person) =>
                  ["Director", "Producer", "Screenplay", "Writer"].includes(
                    person.job
                  )
                )
                .slice(0, 8)
                .map((person) => (
                  <Link
                    href={`/results/person/${person.id}`}
                    key={`${person.id}-${person.job}`}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors"
                  >
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-white/70 text-sm">{person.job}</div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">
            Technical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movie.budget > 0 && (
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="text-white/70 text-sm">Budget</div>
                <div className="text-white font-medium">
                  ${movie.budget.toLocaleString()}
                </div>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="text-white/70 text-sm">Revenue</div>
                <div className="text-white font-medium">
                  ${movie.revenue.toLocaleString()}
                </div>
              </div>
            )}
            {movie.status && (
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="text-white/70 text-sm">Status</div>
                <div className="text-white font-medium">{movie.status}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetail;
