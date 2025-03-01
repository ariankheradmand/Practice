import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SEO from "@/components/SEO";
import {
  Film,
  Popcorn,
  Trophy,
  Rocket,
  Clock,
  ChevronLeft,
  Tag,
  Bomb,
  Compass,
  Laugh,
  Skull,
  Heart,
  PaintBucket,
  ShieldAlert,
  Search,
  Wand2,
} from "lucide-react";
import "../../app/globals.css";

const MoviesPage = () => {
  const categories = [
    {
      id: "popular",
      title: "Popular Movies",
      description:
        "Discover the most popular movies currently watched by millions.",
      icon: Popcorn,
      color: "from-blue-500 to-purple-500",
      image:
        "https://image.tmdb.org/t/p/original/meyhnvssZOPPjud4F1CjOb4snET.jpg",
    },
    {
      id: "top_rated",
      title: "Top Rated Movies",
      description: "The highest rated films of all time.",
      icon: Trophy,
      color: "from-yellow-500 to-amber-500",
      image:
        "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    },
    {
      id: "upcoming",
      title: "Upcoming Movies",
      description: "Get a sneak peek at movies coming soon to theaters.",
      icon: Rocket,
      color: "from-green-500 to-emerald-500",
      image:
        "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
    },
    {
      id: "now_playing",
      title: "Now Playing",
      description: "Movies currently in theaters near you.",
      icon: Clock,
      color: "from-red-500 to-orange-500",
      image:
        "https://image.tmdb.org/t/p/original/4woSOUD0equAYzvwhWBHIJDCM88.jpg",
    },
  ];

  const specialCollections = [
    {
      id: "custom_with_genres=28,12",
      title: "Action & Adventure",
      description: "Heart-pumping action and thrilling adventures.",
      color: "from-orange-500 to-red-500",
      icon: Bomb,
    },
    {
      id: "custom_with_genres=27",
      title: "Horror",
      description: "Spine-chilling tales that will keep you up at night.",
      color: "from-gray-700 to-gray-900",
      icon: Skull,
    },
    {
      id: "custom_with_genres=35",
      title: "Comedy",
      description: "Movies that will keep you laughing from start to finish.",
      color: "from-yellow-400 to-amber-500",
      icon: Laugh,
    },
    {
      id: "custom_with_genres=10749",
      title: "Romance",
      description: "Fall in love with these heartwarming stories.",
      color: "from-pink-400 to-red-400",
      icon: Heart,
    },
    {
      id: "custom_with_genres=878",
      title: "Science Fiction",
      description: "Explore new worlds and futuristic technologies.",
      color: "from-indigo-500 to-blue-600",
      icon: Rocket,
    },
    {
      id: "custom_with_genres=16",
      title: "Animation",
      description: "Colorful animated films for all ages.",
      color: "from-purple-500 to-pink-500",
      icon: PaintBucket,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="Explore Movies - MovieHub"
        description="Browse our vast collection of movies by category, genre, and more. Find the latest blockbusters, classics, and hidden gems."
        canonical="/movies"
        keywords={[
          "movies",
          "films",
          "blockbusters",
          "cinema",
          "watch movies",
          "movie categories",
          "movie genres",
        ]}
        openGraph={{
          images: [
            {
              url: "/movies-og-image.jpg",
              width: 1200,
              height: 630,
              alt: "MovieHub Movies Page",
            },
          ],
        }}
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">Movies</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
            Explore Movies
          </h1>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/movies/category/${category.id}`}
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
                href={`/movies/category/${collection.id}`}
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

export default MoviesPage;
