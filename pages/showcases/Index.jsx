import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import fetchData from '../../utils/tmdb';
import "../../app/globals.css"
const LandingPage = () => {
  // State Management
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularDirectors, setPopularDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch all required data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          featuredData,
          trendingData,
          topRatedData,
          upcomingData,
          genresData
        ] = await Promise.all([
          fetchData('/movie/now_playing'),
          fetchData('/trending/movie/week'),
          fetchData('/movie/top_rated'),
          fetchData('/movie/upcoming'),
          fetchData('/genre/movie/list')
        ]);

        setFeaturedMovies(featuredData.results.slice(0, 6));
        setTrendingMovies(trendingData.results);
        setTopRatedMovies(topRatedData.results);
        setUpcomingMovies(upcomingData.results);
        setGenres(genresData.genres);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Search functionality
  const handleSearch = useCallback(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await fetchData('/search/movie', { query });
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Auto-slide for hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  // Custom Components
  const MovieCard = ({ movie, isLarge = false }) => (
    <div 
      className={`relative group ${
        isLarge ? 'col-span-2 row-span-2' : ''
      } bg-[#1E2A38] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300`}
    >
      <div className="aspect-[2/3] relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-6">
            <h4 className="text-xl font-semibold text-white mb-2">{movie.title}</h4>
            <p className="text-sm text-white/80 mb-2">
              {movie.release_date?.split('-')[0]}
            </p>
            <div className="flex gap-2">
              {movie.genre_ids?.slice(0, 2).map(genreId => (
                <span 
                  key={genreId}
                  className="text-xs bg-[#007BFF]/20 text-[#007BFF] px-2 py-1 rounded"
                >
                  {genres.find(g => g.id === genreId)?.name}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/60 mt-2 line-clamp-2">
              {movie.overview}
            </p>
            <button 
              className="mt-4 bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:bg-[#007BFF]/80 transition-colors"
              onClick={() => setActiveTrailer(movie)}
            >
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const GenreFilter = () => (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
      <button
        onClick={() => setSelectedGenre(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap ${
          selectedGenre === null
            ? 'bg-[#007BFF] text-white'
            : 'bg-[#1E2A38] text-white/80 hover:bg-[#007BFF]/20'
        }`}
      >
        All Genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => setSelectedGenre(genre.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedGenre === genre.id
              ? 'bg-[#007BFF] text-white'
              : 'bg-[#1E2A38] text-white/80 hover:bg-[#007BFF]/20'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );

  const TrailerModal = () => (
    activeTrailer && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="relative w-full max-w-4xl p-4">
          <button
            onClick={() => setActiveTrailer(null)}
            className="absolute top-0 right-0 m-4 text-white hover:text-[#007BFF]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="aspect-video bg-[#1E2A38] rounded-lg">
            {/* Placeholder for actual trailer implementation */}
            <div className="flex items-center justify-center h-full">
              <p className="text-white">Trailer for {activeTrailer.title}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#E5E5E5] font-['Poppins']">
      {/* Hero Section with Auto-sliding */}
      <header className="relative h-screen">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent" />
          </div>
        ))}

        {/* Navigation */}
        <nav className="relative z-20 px-6 py-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                FilmHub
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link href="/movies" className="text-white hover:text-[#007BFF] transition-colors">
                  Movies
                </Link>
                <Link href="/series" className="text-white hover:text-[#007BFF] transition-colors">
                  Series
                </Link>
                <Link href="/directors" className="text-white hover:text-[#007BFF] transition-colors">
                  Directors
                </Link>
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-64 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-[#1E2A38] rounded-lg shadow-xl overflow-hidden">
                      {searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          className="block px-4 py-3 hover:bg-[#007BFF]/20 transition-colors"
                        >
                          <h4 className="text-white font-medium">{movie.title}</h4>
                          <p className="text-sm text-white/60">
                            {movie.release_date?.split('-')[0]}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <button className="bg-[#007BFF] text-white px-6 py-2 rounded-lg hover:bg-[#007BFF]/80 transition-colors">
                  Sign In
                </button>
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-30 bg-[#0A192F]">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="text-2xl font-bold text-white">
                  FilmHub
                </Link>
                <button
                  className="text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                <Link
                  href="/movies"
                  className="text-xl text-white hover:text-[#007BFF] transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/series"
                  className="text-xl text-white hover:text-[#007BFF] transition-colors"
                >
                  Series
                </Link>
                <Link
                  href="/directors"
                  className="text-xl text-white hover:text-[#007BFF] transition-colors"
                >
                  Directors
                </Link>
                <button className="bg-[#007BFF] text-white px-6 py-3 rounded-lg hover:bg-[#007BFF]/80 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {featuredMovies[currentSlide]?.title}
            </h1>
            <p className="text-xl text-white/80 mb-8 line-clamp-3">
              {featuredMovies[currentSlide]?.overview}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTrailer(featuredMovies[currentSlide])}
                className="bg-[#007BFF] text-white px-8 py-4 rounded-lg hover:scale-105 transition-transform"
              >
                Watch Trailer
              </button>
              <Link
                href={`/movie/${featuredMovies[currentSlide]?.id}`}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-[#007BFF] w-12'
                  : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Trending Movies Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8 text-white">Trending Now</h2>
          <GenreFilter />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingMovies
              .filter(movie => 
                !selectedGenre || movie.genre_ids.includes(selectedGenre)
              )
              .map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#1E2A38]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12 text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {genres.slice(0, 8).map(genre => (
              <div
                key={genre.id}
                className="relative group overflow-hidden rounded-lg aspect-video"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-semibold text-white text-center">
                    {genre.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-[#007BFF]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/genre/${genre.id}`}
                    className="text-white font-semibold"
                  >
                    Explore {genre.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section with Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8 text-white">Top Rated</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">
                {topRatedMovies.map(movie => (
                  <div
                    key={movie.id}
                    className="flex-none w-80 snap-start"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-[#1E2A38]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12 text-white">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingMovies.slice(0, 6).map(movie => (
              <div
                key={movie.id}
                className="bg-[#0A192F] rounded-lg overflow-hidden group"
              >
                <div className="aspect-video relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {movie.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      Release Date: {movie.release_date}
                    </p>
                    <button
                      onClick={() => setActiveTrailer(movie)}
                      className="bg-[#007BFF] text-white w-full py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0"
                    >
                      Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-[#1E2A38] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Stay Updated
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest movie releases, exclusive content,
              and special offers.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-[#0A192F] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              />
              <button className="bg-[#007BFF] text-white px-8 py-4 rounded-lg hover:bg-[#007BFF]/80 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-[#1E2A38]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-semibold mb-6 text-white">
                Take FilmHub Everywhere
              </h2>
              <p className="text-white/80 mb-8">
                Download our mobile app to watch your favorite movies on the go.
                Available for iOS and Android devices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#007BFF] text-white px-8 py-4 rounded-lg hover:bg-[#007BFF]/80 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 12.314l-3.257 3.257L19.839 21.6a.984.984 0 001.161-1.161l-3.95-8.125zM4.15 2.4A.984.984 0 002.989 3.561l3.95 8.125 3.257-3.257L4.15 2.4zm7.85 7.85l3.257-3.257L7.232 2.4a.984.984 0 00-1.161 1.161l3.95 8.125 1.979-1.436zm0 0l-3.257 3.257 3.95 8.125a.984.984 0 001.161 1.161l6.025-4.929-3.257-3.257-4.622-4.357z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-[#007BFF] text-white px-8 py-4 rounded-lg hover:bg-[#007BFF]/80 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 2.4A.984.984 0 002.4 3.609l8.125 8.125-8.125 8.125a.984.984 0 001.209 1.209l8.125-8.125 8.125 8.125a.984.984 0 001.209-1.209l-8.125-8.125 8.125-8.125A.984.984 0 0020.859 2.4l-8.125 8.125L4.609 2.4a.984.984 0 00-1 0z"/>
                  </svg>
                  Play Store
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-[9/16] bg-[#0A192F] rounded-3xl overflow-hidden shadow-2xl">
                {/* App Screenshot Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/50">App Screenshot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12 text-white text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does FilmHub work?",
                answer: "FilmHub is a streaming platform that brings you the latest movies and TV shows. Simply create an account, choose your subscription plan, and start watching on any device."
              },
              {
                question: "What devices can I watch on?",
                answer: "You can watch on your smartphone, tablet, smart TV, laptop, or streaming device. Our app is available on iOS, Android, and major smart TV platforms."
              },
              {
                question: "Can I download movies to watch offline?",
                answer: "Yes! Premium subscribers can download movies and shows to watch offline. Perfect for traveling or when you have limited internet access."
              },
              {
                question: "How much does FilmHub cost?",
                answer: "We offer several subscription plans starting from $9.99/month. You can cancel or change your plan at any time."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-[#1E2A38] rounded-lg overflow-hidden"
              >
                <button
                  className="w-full p-6 text-left text-white font-semibold flex justify-between items-center"
                  onClick={() => {
                    // Toggle FAQ
                  }}
                >
                  {faq.question}
                  <svg
                    className="w-6 h-6 transform transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="px-6 pb-6">
                  <p className="text-white/80">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A192F] py-20 border-t border-[#1E2A38]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">FilmHub</h3>
              <p className="text-white/60 mb-6">
                Your premier destination for movies and TV shows. Watch anywhere,
                anytime.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-[#007BFF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-[#007BFF]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-[#007BFF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/movies" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    TV Series
                  </Link>
                </li>
                <li>
                  <Link href="/directors" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Directors
                  </Link>
                </li>
                <li>
                  <Link href="/genres" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Genres
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/faq" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/licensing" className="text-white/60 hover:text-[#007BFF] transition-colors">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1E2A38]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60">
                © 2025 FilmHub. All rights reserved.
              </p>
              <div className="flex gap-4">
                <select className="bg-[#1E2A38] text-white/60 px-4 py-2 rounded-lg">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
                <select className="bg-[#1E2A38] text-white/60 px-4 py-2 rounded-lg">
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Trailer Modal */}
      {activeTrailer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/80" />
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-[#1E2A38] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setActiveTrailer(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="aspect-video bg-black">
                {/* Replace with actual video player integration */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/60">Trailer for {activeTrailer.title}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activeTrailer.title}
                </h3>
                <p className="text-white/60">
                  {activeTrailer.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
