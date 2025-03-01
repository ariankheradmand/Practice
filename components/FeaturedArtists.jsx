import React from "react";
import Link from "next/link";
import { Award } from "lucide-react";

const FeaturedArtists = ({ artists }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg shadow-md">
            <Award className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-semibold text-white">Featured Artists</h2>
        </div>
        <Link href="/movies/category/custom_sort_by=vote_average.desc&vote_count.gte=1000">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-sm text-gray-300">View All</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="group relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w300${
                  artist.profile_path || "/placeholder.jpg"
                }`}
                alt={artist.name}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-[70%] group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-sm font-medium text-white">{artist.name}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {artist.known_for_department}
              </p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/results/person/${artist.id}`}>
                  <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-white">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtists;
