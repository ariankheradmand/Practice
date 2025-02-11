import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, PlayCircle } from 'lucide-react';
import fetchData from "../utils/tmdb";

// Genre mapping based on TMDB genre IDs
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure', 
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies with more detailed error handling and loading state
  const fetchPopularMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchData("/trending/movie/day", {
        language: "en-US",
        page: 1,
      });

      // Enhanced data processing with genre mapping
      const moviesWithDetails = data.results.map(movie => {
        // Map genre IDs to genre names, limit to 2 genres
        const mappedGenres = movie.genre_ids
          .slice(0, 2)
          .map(genreId => GENRE_MAP[genreId] || 'Unknown')
          .filter(Boolean); // Remove any undefined genres

        return {
          ...movie,
          imagePath: movie.backdrop_path || movie.poster_path || '',
          genres: mappedGenres,
          formattedReleaseDate: new Date(movie.release_date).getFullYear()
        };
      });

      setMovies(moviesWithDetails);
      setIsLoading(false);
    } catch (err) {
      setError("Unable to fetch movies. Please try again later.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  // Navigation handlers with keyboard support
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : movies.length - 1));
  }, [movies.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < movies.length - 1 ? prev + 1 : 0));
  }, [movies.length]);

  // Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Render loading or error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[624px] w-full">
        <div className="animate-pulse text-gray-500">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[624px] w-full bg-red-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // No movies found
  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-[624px] w-full">
        <p className="text-gray-500">No movies found</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const baseImageUrl = "https://image.tmdb.org/t/p/original/";

  return (
    <div className="relative w-full max-w-6xl mx-auto group">
      {/* Movie Showcase Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-10">
          <img
            src={`${baseImageUrl}${currentMovie.imagePath}`}
            alt={currentMovie.title}
            className="w-full h-full object-cover opacity-70 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>

        {/* Movie Details Overlay */}
        <div className="absolute inset-0 z-20 text-white p-6 flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="bg-black/30 rounded-xl px-3 py-1">
              <span className="text-sm">{currentMovie.formattedReleaseDate}</span>
            </div>
            <div className="flex items-center bg-black/30 rounded-xl px-3 py-1 gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">
                {(currentMovie.vote_average * 10 / 10).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold drop-shadow-lg">{currentMovie.title}</h2>
            <div className="flex items-center gap-2">
              {currentMovie.genres.map((genre, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 px-2 py-1 rounded-full text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition">
              <PlayCircle className="w-5 h-5" />
              Watch Now
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 z-30 flex items-center">
          <button 
            onClick={handlePrev} 
            className="bg-black/50 hover:bg-black/70 p-2 rounded-full m-4 transition"
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 z-30 flex items-center">
          <button 
            onClick={handleNext} 
            className="bg-black/50 hover:bg-black/70 p-2 rounded-full m-4 transition"
          >
            <ChevronRight className="text-white w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-red-600 w-4' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}