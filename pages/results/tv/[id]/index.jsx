import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import fetchData from "../../../../utils/tmdb";
import {
  Clock,
  Flag,
  Star,
  Calendar,
  Share2,
  Tv,
  PlayCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import "../../../../app/globals.css";

const TVShowDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showSeasonDrawer, setShowSeasonDrawer] = useState(false);

  useEffect(() => {
    const fetchTVShowDetails = async (showId) => {
      try {
        const [showData, seasonData] = await Promise.all([
          fetchData(`/tv/${showId}?language=en-US`),
          fetchData(`/tv/${showId}/season/${selectedSeason}?language=en-US`),
        ]);
        setShow({ ...showData, currentSeason: seasonData });
      } catch (error) {
        console.error("Failed to fetch TV show details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTVShowDetails(id);
    }
  }, [id, selectedSeason]);

  const formatEpisodeCount = (count) => {
    return `${count} Episode${count !== 1 ? "s" : ""}`;
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

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="text-white text-xl">TV Show not found</div>
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
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
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
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2">
                  <Tv className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {show.number_of_seasons} Season
                    {show.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Rating and Share Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">
                    {show.vote_average?.toFixed(1)} / 10
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowShareTooltip(!showShareTooltip)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Share TV show"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  {showShareTooltip && (
                    <div className="absolute right-0 mt-2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm">
                      Share this show
                    </div>
                  )}
                </div>
              </div>

              {/* Season Selection */}
              <div className="bg-white/5 rounded-2xl p-4">
                <button
                  onClick={() => setShowSeasonDrawer(!showSeasonDrawer)}
                  className="w-full flex items-center justify-between text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <span className="font-medium">Season {selectedSeason}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showSeasonDrawer ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showSeasonDrawer && (
                  <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                    {Array.from(
                      { length: show.number_of_seasons },
                      (_, i) => i + 1
                    ).map((season) => (
                      <button
                        key={season}
                        onClick={() => {
                          setSelectedSeason(season);
                          setShowSeasonDrawer(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedSeason === season
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        Season {season}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-2/3 text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {show.name}
                </h1>
                {show.tagline && (
                  <p className="text-xl text-white/70 italic">{show.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={show.first_air_date}>
                    {new Date(show.first_air_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Flag className="w-4 h-4" />
                  <span className="uppercase">{show.original_language}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <PlayCircle className="w-4 h-4" />
                  <span>{formatEpisodeCount(show.number_of_episodes)}</span>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-white/90">
                {show.overview}
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {show.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 text-sm cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Episodes Section */}
              {show.currentSeason && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    Season {selectedSeason} Episodes
                  </h2>
                  <div className="space-y-4">
                    {show.currentSeason.episodes?.map((episode) => (
                      <div
                        key={episode.id}
                        className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {episode.still_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                alt={episode.name}
                                className="w-32 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                                <Tv className="w-8 h-8 text-white/30" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              <p className="text-sm text-white/70">
                                {episode.runtime} min
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

export default TVShowDetail;
