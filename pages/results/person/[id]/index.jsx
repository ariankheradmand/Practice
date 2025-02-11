import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import fetchData from "../../../../utils/tmdb";
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
  Heart
} from "lucide-react";
import "../../../../app/globals.css"

const PersonDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [person, setPerson] = useState(null);
  const [selectedTab, setSelectedTab] = useState('movies');
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBiography, setShowBiography] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async (personId) => {
      try {
        const [personData, credits] = await Promise.all([
          fetchData(`/person/${personId}?language=en-US`),
          fetchData(`/person/${personId}/combined_credits?language=en-US`)
        ]);
        setPerson({ ...personData, credits });
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
    const birth = new Date(birthdate);
    const end = deathdate ? new Date(deathdate) : new Date();
    const age = Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  };

  const sortCredits = (credits, type) => {
    return credits
      ?.filter(credit => type === 'all' || credit.media_type === type)
      ?.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || '';
        const dateB = b.release_date || b.first_air_date || '';
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

  const movieCredits = sortCredits(person.credits?.cast, 'movie');
  const tvCredits = sortCredits(person.credits?.cast, 'tv');

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="relative animate-fadeIn">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Profile Section */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                  alt={person.name}
                  className={`w-full h-auto transform transition-all duration-500 group-hover:scale-105 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                {person.popularity > 20 && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Popular</span>
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Personal Info</h2>
                
                <div className="space-y-4">
                  {person.birthday && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Born</span>
                      </div>
                      <p className="mt-1 text-white">
                        {new Date(person.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {!person.deathday && ` (${calculateAge(person.birthday)} years old)`}
                      </p>
                    </div>
                  )}

                  {person.deathday && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Died</span>
                      </div>
                      <p className="mt-1 text-white">
                        {new Date(person.deathday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {` (${calculateAge(person.birthday, person.deathday)} years old)`}
                      </p>
                    </div>
                  )}

                  {person.place_of_birth && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Place of Birth</span>
                      </div>
                      <p className="mt-1 text-white">{person.place_of_birth}</p>
                    </div>
                  )}

                  {person.known_for_department && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Clapperboard className="w-4 h-4" />
                        <span className="text-sm font-medium">Known For</span>
                      </div>
                      <p className="mt-1 text-white">{person.known_for_department}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareTooltip(!showShareTooltip)}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Profile</span>
                </button>
                {showShareTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm">
                    Share this profile
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-2/3 text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {person.name}
                </h1>
                {person.also_known_as?.length > 0 && (
                  <p className="text-lg text-white/70">
                    Also known as: {person.also_known_as[0]}
                  </p>
                )}
              </div>

              {/* Biography */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Biography</h2>
                <div className="relative">
                  <p className={`text-lg leading-relaxed text-white/90 ${
                    !showBiography ? 'line-clamp-4' : ''
                  }`}>
                    {person.biography || "No biography available."}
                  </p>
                  {person.biography?.length > 300 && (
                    <button
                      onClick={() => setShowBiography(!showBiography)}
                      className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {showBiography ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>

              {/* Credits Navigation */}
              <div className="border-b border-white/10">
                <nav className="flex gap-6">
                  <button
                    onClick={() => setSelectedTab('movies')}
                    className={`pb-4 flex items-center gap-2 transition-colors ${
                      selectedTab === 'movies'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Film className="w-5 h-5" />
                    <span>Movies</span>
                    {movieCredits?.length > 0 && (
                      <span className="ml-2 text-sm bg-white/10 px-2 py-1 rounded-full">
                        {movieCredits.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedTab('tv')}
                    className={`pb-4 flex items-center gap-2 transition-colors ${
                      selectedTab === 'tv'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Tv className="w-5 h-5" />
                    <span>TV Shows</span>
                    {tvCredits?.length > 0 && (
                      <span className="ml-2 text-sm bg-white/10 px-2 py-1 rounded-full">
                        {tvCredits.length}
                      </span>
                    )}
                  </button>
                </nav>
              </div>

              {/* Credits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(selectedTab === 'movies' ? movieCredits : tvCredits)?.map((credit) => (
                  <div
                    key={credit.id}
                    className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all cursor-pointer"
                    onClick={() => router.push(`/${credit.media_type}/${credit.id}`)}
                  >
                    <div className="flex gap-4">
                      {credit.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                          alt={credit.title || credit.name}
                          className="w-20 h-30 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-30 bg-white/10 rounded-lg flex items-center justify-center">
                          <Clapperboard className="w-8 h-8 text-white/30" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-blue-400 transition-colors">
                          {credit.title || credit.name}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          as {credit.character || 'Unknown Role'}
                        </p>
                        <p className="text-sm text-white/50 mt-1">
                          {new Date(credit.release_date || credit.first_air_date).getFullYear() || 'TBA'}
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
    </div>
  );
};

export default PersonDetail;