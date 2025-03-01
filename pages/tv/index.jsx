import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Tv,
  Award,
  Radio,
  CalendarDays,
  ChevronLeft,
  Tag,
  Bomb, // Action & Adventure
  Drama, // Drama
  Laugh, // Comedy
  Search, // Mystery
  Rocket, // Sci-Fi
  ShieldAlert, // Crime
} from "lucide-react";
import "../../app/globals.css";

const TVShowsPage = () => {
  const categories = [
    {
      id: "popular",
      title: "Popular TV Shows",
      description:
        "Discover the most popular TV series currently watched by millions.",
      icon: Radio,
      color: "from-purple-500 to-indigo-500",
      image:
        "https://image.tmdb.org/t/p/original/mAJ84W6I8I272Da87qplS8Fd7mD.jpg",
    },
    {
      id: "top_rated",
      title: "Top Rated TV Shows",
      description: "The highest rated series of all time.",
      icon: Award,
      color: "from-yellow-500 to-amber-500",
      image:
        "https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    },
    {
      id: "on_the_air",
      title: "Currently Airing",
      description: "TV shows that are currently on the air.",
      icon: Tv,
      color: "from-green-500 to-emerald-500",
      image:
        "https://image.tmdb.org/t/p/original/9PqD3wSIjntyJDBzMNuxuKHwpUD.jpg",
    },
    {
      id: "airing_today",
      title: "Airing Today",
      description: "TV shows that are airing today.",
      icon: CalendarDays,
      color: "from-blue-500 to-cyan-500",
      image:
        "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    },
  ];

  const specialCollections = [
    {
      id: "custom_with_genres=10759",
      title: "Action & Adventure",
      description: "TV shows that feature high-stakes action and adventure.",
      color: "from-orange-500 to-red-500",
      icon: Bomb,
    },
    {
      id: "custom_with_genres=18",
      title: "Drama",
      description: "Character-driven series with emotional storylines.",
      color: "from-blue-600 to-indigo-600",
      icon: Drama,
    },
    {
      id: "custom_with_genres=35",
      title: "Comedy",
      description: "Shows that will keep you laughing episode after episode.",
      color: "from-yellow-400 to-amber-500",
      icon: Laugh,
    },
    {
      id: "custom_with_genres=9648",
      title: "Mystery",
      description:
        "Intriguing series filled with suspense and unsolved questions.",
      color: "from-slate-700 to-slate-900",
      icon: Search,
    },
    {
      id: "custom_with_genres=10765",
      title: "Sci-Fi & Fantasy",
      description: "Shows that take you to other worlds, times and dimensions.",
      color: "from-indigo-500 to-blue-600",
      icon: Rocket,
    },
    {
      id: "custom_with_genres=80",
      title: "Crime",
      description:
        "TV series focusing on criminal investigations and the justice system.",
      color: "from-gray-600 to-gray-800",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">TV Shows</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-lg">
              <Tv className="w-8 h-8 text-white" />
            </div>
            Explore TV Shows
          </h1>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/tv/category/${category.id}`}
              className="group"
            >
              <div className="relative rounded-xl overflow-hidden h-60 shadow-lg">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                  <div
                    className={`bg-gradient-to-r ${category.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {category.title}
                  </h2>
                  <p className="text-white/80">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse by Genre Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Tag className="w-6 h-6 text-white/70" />
              Browse by Genre
            </h2>
            <Link href="/genres">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                View All Genres
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {specialCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/tv/category/${collection.id}`}
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${collection.color} rounded-xl overflow-hidden aspect-video shadow-lg transform hover:scale-[1.03] transition-all duration-300`}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-black/30 hover:bg-black/20 transition-colors">
                    {collection.icon && (
                      <collection.icon className="w-5 h-5 text-white mb-2" />
                    )}
                    <h3 className="text-white font-medium text-lg">
                      {collection.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TVShowsPage;
