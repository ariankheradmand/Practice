import React from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import {
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
  Sparkles, // Default for any other genres
} from "lucide-react";

const GenresSection = ({ genres }) => {
  // Map genre IDs to appropriate icons
  const getGenreIcon = (genreId) => {
    const iconMap = {
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
    };

    const GenreIcon = iconMap[genreId] || Sparkles;
    return GenreIcon;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg shadow-md">
            <Ticket className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-semibold text-white">Popular Genres</h2>
        </div>
        <Link href="/genres">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <span className="text-sm text-gray-300">View All</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre) => {
          const GenreIcon = getGenreIcon(genre.id);
          return (
            <Link key={genre.id} href={`/movies/genre/${genre.id}`}>
              <div className="relative group overflow-hidden rounded-xl aspect-video cursor-pointer hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/50 group-hover:from-gray-900/70 group-hover:to-gray-900/30 transition-colors duration-300" />
                <div className="relative h-full flex flex-col items-center justify-center gap-2">
                  <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                    <GenreIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                    {genre.name}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GenresSection;
