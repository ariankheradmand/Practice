import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import Section from "@/components/Section";
import fetchData from "../../../../utils/tmdb";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Star,
  Share2,
  Film,
  Tv,
  Clapperboard,
  ArrowUpRight,
  Users,
  Award,
  Heart,
  ExternalLink,
  UserCircle,
} from "lucide-react";
import "../../../../app/globals.css";

const PersonDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [person, setPerson] = useState(null);
  const [selectedTab, setSelectedTab] = useState("movies");
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBiography, setShowBiography] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async (personId) => {
      try {
        const [personData, credits, externalIds, images] = await Promise.all([
          fetchData(`/person/${personId}?language=en-US`),
          fetchData(`/person/${personId}/combined_credits?language=en-US`),
          fetchData(`/person/${personId}/external_ids`),
          fetchData(`/person/${personId}/images`),
        ]);
        setPerson({ ...personData, credits, externalIds, images });
      } catch (error) {
        console.error("Failed to fetch person details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonDetails(id);
    }
  }, [id]);

  const calculateAge = (birthdate, deathdate = null) => {
    if (!birthdate) return null;

    const birth = new Date(birthdate);
    const end = deathdate ? new Date(deathdate) : new Date();
    const diff = end - birth;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const sortCredits = (credits, type) => {
    if (!credits) return [];

    const filteredCredits =
      type === "movie"
        ? credits.cast.filter((credit) => credit.media_type === "movie")
        : credits.cast.filter((credit) => credit.media_type === "tv");

    return filteredCredits.sort((a, b) => {
      const dateA = type === "movie" ? a.release_date : a.first_air_date;
      const dateB = type === "movie" ? b.release_date : b.first_air_date;

      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB) - new Date(dateA);
    });
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

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="text-white text-xl">Person not found</div>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const TabButton = ({ icon: Icon, label }) => (
    <button
      onClick={() => setSelectedTab(label.toLowerCase())}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        selectedTab === label.toLowerCase()
          ? "bg-white/20"
          : "bg-white/10 hover:bg-white/15"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const socialLinks = [
    {
      name: "IMDb",
      id: person.externalIds?.imdb_id,
      url: `https://www.imdb.com/name/${person.externalIds?.imdb_id}`,
      color: "bg-yellow-600",
    },
    {
      name: "Instagram",
      id: person.externalIds?.instagram_id,
      url: `https://www.instagram.com/${person.externalIds?.instagram_id}`,
      color: "bg-pink-600",
    },
    {
      name: "Twitter",
      id: person.externalIds?.twitter_id,
      url: `https://twitter.com/${person.externalIds?.twitter_id}`,
      color: "bg-blue-500",
    },
    {
      name: "Facebook",
      id: person.externalIds?.facebook_id,
      url: `https://www.facebook.com/${person.externalIds?.facebook_id}`,
      color: "bg-blue-700",
    },
  ].filter((link) => link.id);

  const moviesCredits = sortCredits(person.credits, "movie");
  const tvCredits = sortCredits(person.credits, "tv");

  return (
    <div className="min-h-screen bg-black pt-20">
      <Navbar />

      <div className="relative animate-fadeIn ">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column - Profile Image & Info */}
            <div className="w-full md:w-1/3 flex flex-col gap-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/original${person.profile_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={person.name}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/500x750?text=No+Image";
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">
                    {person.credits?.cast?.length || 0} Credits
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
                    aria-label="Like person"
                  >
                    <Heart
                      className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                    />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareTooltip(!showShareTooltip)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    {showShareTooltip && (
                      <div className="absolute right-0 mt-2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm">
                        Share this profile
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Personal Info
                </h2>

                <div className="space-y-4">
                  {person.known_for_department && (
                    <div>
                      <h3 className="text-white/70 text-sm">Known For</h3>
                      <p className="text-white">
                        {person.known_for_department}
                      </p>
                    </div>
                  )}

                  {person.birthday && (
                    <div>
                      <h3 className="text-white/70 text-sm">Born</h3>
                      <p className="text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/60" />
                        {new Date(person.birthday).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {!person.deathday && (
                          <span className="text-white/60">
                            ({calculateAge(person.birthday)} years old)
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {person.deathday && (
                    <div>
                      <h3 className="text-white/70 text-sm">Died</h3>
                      <p className="text-white flex items-center gap-2">
                        {new Date(person.deathday).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <span className="text-white/60">
                          (Age {calculateAge(person.birthday, person.deathday)})
                        </span>
                      </p>
                    </div>
                  )}

                  {person.place_of_birth && (
                    <div>
                      <h3 className="text-white/70 text-sm">Place of Birth</h3>
                      <p className="text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/60" />
                        {person.place_of_birth}
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {socialLinks.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-white/70 text-sm mb-3">Social Media</h3>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 ${link.color} rounded-full px-3 py-1 text-white text-sm hover:opacity-90 transition-opacity`}
                        >
                          {link.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Photos */}
              {person.images?.profiles?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Photos</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {person.images.profiles.slice(0, 4).map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w185${image.file_path}`}
                          alt={`Photo of ${person.name}`}
                          className="w-full h-auto object-cover aspect-[2/3] hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  {person.images.profiles.length > 4 && (
                    <button className="w-full py-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-sm">
                      View All Photos ({person.images.profiles.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Biography & Credits */}
            <div className="w-full md:w-2/3 text-white space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {person.name}
                </h1>
                <div className="text-white/70">
                  {person.known_for_department}
                </div>
              </div>

              {/* Biography */}
              {person.biography && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Biography</h2>
                  <div
                    className={`text-white/80 leading-relaxed space-y-4 ${
                      !showBiography && "line-clamp-5"
                    }`}
                  >
                    {person.biography.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  {person.biography.length > 300 && (
                    <button
                      onClick={() => setShowBiography(!showBiography)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {showBiography ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              )}

              {/* Credits Tabs */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 text-white">
                  <TabButton icon={Film} label="Movies" />
                  <TabButton icon={Tv} label="TV Shows" />
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                  {selectedTab === "movies" ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium flex items-center gap-2">
                        <Film className="w-5 h-5 text-white/70" />
                        Movie Appearances ({moviesCredits.length})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {moviesCredits.slice(0, 10).map((movie) => (
                          <Link
                            href={`/results/movie/${movie.id}`}
                            key={movie.id}
                            className="flex gap-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                          >
                            <div className="w-16 h-24 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                    : "https://via.placeholder.com/92x138?text=No+Image"
                                }
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/92x138?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {movie.title}
                              </h4>
                              {movie.character && (
                                <p className="text-sm text-white/70 truncate">
                                  as {movie.character}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
                                {movie.release_date && (
                                  <span>
                                    {new Date(movie.release_date).getFullYear()}
                                  </span>
                                )}
                                {movie.vote_average > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {moviesCredits.length > 10 && (
                        <button className="w-full py-3 text-white bg-white/10 hover:bg-white/15 transition-colors rounded-lg">
                          View All Movies ({moviesCredits.length})
                        </button>
                      )}

                      {moviesCredits.length === 0 && (
                        <div className="text-center py-8 text-white/60">
                          No movie credits found for this person.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium flex items-center gap-2">
                        <Tv className="w-5 h-5 text-white/70" />
                        TV Appearances ({tvCredits.length})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tvCredits.slice(0, 10).map((show) => (
                          <Link
                            href={`/results/tv/${show.id}`}
                            key={show.id}
                            className="flex gap-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                          >
                            <div className="w-16 h-24 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  show.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${show.poster_path}`
                                    : "https://via.placeholder.com/92x138?text=No+Image"
                                }
                                alt={show.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/92x138?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {show.name}
                              </h4>
                              {show.character && (
                                <p className="text-sm text-white/70 truncate">
                                  as {show.character}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
                                {show.first_air_date && (
                                  <span>
                                    {new Date(
                                      show.first_air_date
                                    ).getFullYear()}
                                  </span>
                                )}
                                {show.vote_average > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span>{show.vote_average.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {tvCredits.length > 10 && (
                        <button className="w-full py-3 text-white bg-white/10 hover:bg-white/15 transition-colors rounded-lg">
                          View All TV Shows ({tvCredits.length})
                        </button>
                      )}

                      {tvCredits.length === 0 && (
                        <div className="text-center py-8 text-white/60">
                          No TV credits found for this person.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Known For Section */}
      {person.credits?.cast?.length > 0 && (
        <div className="bg-black/80 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Known For</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {person.credits.cast
                .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
                .slice(0, 6)
                .map((credit) => (
                  <MediaCard
                    key={`${credit.id}-${credit.media_type}`}
                    item={credit}
                    type={credit.media_type}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Worked With Section */}
      {person.credits?.cast?.length > 0 && (
        <div className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">
              Frequently Worked With
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* This is a mockup since we don't have real data for this section */}
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 text-center"
                >
                  <div className="w-full aspect-square rounded-full bg-white/10 mb-3 flex items-center justify-center overflow-hidden">
                    <UserCircle className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="text-white font-medium">
                    Collaborator {index + 1}
                  </div>
                  <div className="text-white/60 text-sm">
                    {2 + index} films together
                  </div>
                </div>
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
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default PersonDetail;
