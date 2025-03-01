import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import MediaCard from "@/components/MediaCard";
import { useWatchlist } from "@/contexts/WatchlistContext";
import fetchData from "../../../../utils/tmdb";
import Link from "next/link";
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
  Heart,
  Users,
  Video,
  Image,
  Film,
  MonitorPlay,
  ArrowRight,
  Play,
} from "lucide-react";
import "../../../../app/globals.css";

const TVShowDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [show, setShow] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [images, setImages] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showSeasonDrawer, setShowSeasonDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("cast");
  const [liked, setLiked] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = show ? isInWatchlist(show.id, "tv") : false;

  useEffect(() => {
    const fetchTVShowDetails = async (showId) => {
      try {
        const [
          showData,
          seasonData,
          creditsData,
          videosData,
          imagesData,
          similarData,
          recommendationsData,
          keywordsData,
          watchProvidersData,
        ] = await Promise.all([
          fetchData(`/tv/${showId}?language=en-US`),
          fetchData(`/tv/${showId}/season/${selectedSeason}?language=en-US`),
          fetchData(`/tv/${showId}/credits`),
          fetchData(`/tv/${showId}/videos`),
          fetchData(`/tv/${showId}/images`),
          fetchData(`/tv/${showId}/similar`),
          fetchData(`/tv/${showId}/recommendations`),
          fetchData(`/tv/${showId}/keywords`),
          fetchData(`/tv/${showId}/watch/providers`),
        ]);

        setShow({ ...showData, currentSeason: seasonData });
        setCredits(creditsData);
        setVideos(videosData);
        setImages(imagesData);
        setSimilar(similarData);
        setRecommendations(recommendationsData);
        setKeywords(keywordsData);
        setWatchProviders(watchProvidersData);
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

  const toggleWatchlist = () => {
    if (!show) return;

    if (inWatchlist) {
      removeFromWatchlist(show.id, "tv");
    } else {
      const watchlistItem = {
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        release_date: show.first_air_date,
        media_type: "tv",
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
                    <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white transition-colors" />
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
                  alt={`TV show still ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        );
      case "similar":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar?.results?.slice(0, 6).map((tvShow) => (
              <MediaCard key={tvShow.id} item={tvShow} type="tv" />
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
    <div className="min-h-screen bg-black pt-20">
      <Navbar />

      <div className="relative animate-fadeIn">
        {/* Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={
              show.backdrop_path
                ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
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
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/original${show.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={show.name}
                  className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/500x750?text=No+Image";
                  }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2">
                  <Tv className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {show.seasons?.length || 0} Seasons
                  </span>
                </div>
              </div>

              {/* Actions and Ratings */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">
                      {show.vote_average?.toFixed(1)} / 10
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
                      aria-label="Like TV show"
                    >
                      <Heart
                        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                      />
                    </button>

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
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  <Link href={`/tv/${id}/watch`}>
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
              {keywords?.results?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.results.map((keyword) => (
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
                {show.status && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Flag className="w-4 h-4" />
                    <span>{show.status}</span>
                  </div>
                )}
              </div>

              <p className="text-lg leading-relaxed text-white/90">
                {show.overview}
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {show.genres?.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/tv/genre/${genre.id}`}
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

      {/* Season Section */}
      <div className="bg-black/80 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Seasons</h2>
            <div className="relative">
              <button
                onClick={() => setShowSeasonDrawer(!showSeasonDrawer)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-4 py-2 text-white"
              >
                <span>Season {selectedSeason}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSeasonDrawer && (
                <div className="absolute right-0 mt-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl w-48 max-h-72 overflow-auto z-10">
                  {show.seasons
                    ?.filter((season) => season.season_number > 0)
                    .map((season) => (
                      <button
                        key={season.id}
                        className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                          selectedSeason === season.season_number
                            ? "bg-white/20 text-white"
                            : "text-white/70"
                        }`}
                        onClick={() => {
                          setSelectedSeason(season.season_number);
                          setShowSeasonDrawer(false);
                        }}
                      >
                        Season {season.season_number}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {show.currentSeason && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 bg-white/5 rounded-xl p-6">
                <div className="w-full md:w-1/4">
                  <img
                    src={
                      show.currentSeason.poster_path
                        ? `https://image.tmdb.org/t/p/w300${show.currentSeason.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={`Season ${selectedSeason} poster`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                </div>
                <div className="w-full md:w-3/4 text-white space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {show.currentSeason.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-white/70">
                      <span>
                        {show.currentSeason.air_date
                          ? new Date(show.currentSeason.air_date).getFullYear()
                          : "Unknown"}
                      </span>
                      <span>•</span>
                      <span>
                        {formatEpisodeCount(
                          show.currentSeason.episodes?.length || 0
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {show.currentSeason.overview ||
                      "No overview available for this season."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Episodes</h3>
                <div className="space-y-4">
                  {show.currentSeason.episodes?.slice(0, 5).map((episode) => (
                    <div
                      key={episode.id}
                      className="flex flex-col md:flex-row gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4"
                    >
                      {episode.still_path && (
                        <div className="w-full md:w-48 h-28 md:h-auto">
                          <img
                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                            alt={`Episode ${episode.episode_number}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/300x170?text=No+Image";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">
                            {episode.episode_number}. {episode.name}
                          </h4>
                          {episode.vote_average > 0 && (
                            <div className="flex items-center gap-1 text-white/80">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">
                                {episode.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-sm line-clamp-2">
                          {episode.overview || "No overview available."}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-xs">
                            {episode.air_date
                              ? new Date(episode.air_date).toLocaleDateString()
                              : "Unknown air date"}
                          </span>
                          <button className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                            <span className="text-sm">More</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {show.currentSeason.episodes?.length > 5 && (
                  <div className="text-center">
                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-white">
                      View All Episodes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations?.results?.length > 0 && (
        <div className="bg-black/90 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Section
              title="Recommended TV Shows"
              icon={Tv}
              color="from-purple-500 to-indigo-500"
              items={recommendations.results}
              type="tv"
              sectionId="recommendations"
            />
          </div>
        </div>
      )}

      {/* Networks */}
      {show.networks?.length > 0 && (
        <div className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Networks</h2>
            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
              {show.networks.map(
                (network) =>
                  network.logo_path && (
                    <div
                      key={network.id}
                      className="bg-white/5 rounded-lg p-4 flex items-center justify-center transition-all hover:bg-white/10"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                        alt={network.name}
                        className="max-h-16 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Created By Section */}
      {show.created_by?.length > 0 && (
        <div className="bg-black/80 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Created By</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {show.created_by.map((person) => (
                <Link
                  href={`/results/person/${person.id}`}
                  key={person.id}
                  className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="mb-3">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/185x185?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-white/5 rounded-lg flex items-center justify-center">
                        <Users className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="text-white font-medium">{person.name}</div>
                  <div className="text-white/70 text-sm">Creator</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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

      <Footer />
    </div>
  );
};

export default TVShowDetail;
