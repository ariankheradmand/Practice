// PopularMovies.js
import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";
import Image from "next/image";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [imageLoading, setImageLoading] = useState(true); // Initially true for all images
  const [next, setNext] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const data = await fetchData("/trending/movie/day", {
          language: "en-US",
          page: 1,
        });

        // Map over results to include image paths in movie objects
        const moviesWithImages = data.results.map(movie => ({
          ...movie,
          imagePath: movie.backdrop_path || ""
        }));

        setMovies(moviesWithImages);
        setImageLoading(false);
      } catch (err) {
        setError("Failed to load popular movies");
        setImageLoading(false); // Stop loading if there's an error
      }
    };
    getPopularMovies();
  }, []);

  const baseImageUrl = "https://image.tmdb.org/t/p/original/";

  const handlePrev = () => {
    setNext(prevNext => prevNext > 0 ? prevNext - 1 : movies.length - 1);
  };

  const handleNext = () => {
    setNext(prevNext => prevNext < movies.length - 1 ? prevNext + 1 : 0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative overflow-hidden">
      {error && <p>{error}</p>}
      <div className="w-11/12 lg:w-7/12 md:w-8/12 h-[193px] md:h-[288px] xl:h-[624px] rounded-t-xl overflow-hidden rounded-xl bg-gradient-to-br from-black/90 via-black to-black/50 bg-[length:200%_200%] animate-gradient shadow-lg relative">
        {movies.length > 0 ? (
          <div key={movies[next].id}>
            
            <div className="flex items-center absolute bg-gradient-to-l from-[] backdrop-blur-[2px] z-30 left-0 top-0 h-full">
              <button onClick={handlePrev} className="text-white px-4 py-2 rounded">
                <Image className="rotate-180" src={"/Next.svg"} height={35} width={35} />
              </button>
            </div>
             
            {/* Title */}
            <div className="flex items-center justify-center top-1 w-full absolute ">
              <div className="flex flex-row-reverse   items-center justify-center gap-2 w-6/12 z-20">
                <h2 className="text-white text-[14px] bg-black/30 p-2 rounded-xl">{movies[next].title}</h2>
              </div>
            </div>

            <div className="flex items-center justify-center w-full absolute bottom-0 right-0">
              <div className="flex flex-row-reverse items-center justify-between w-6/12 z-20">
                <h2 className="text-white text-[14px] ">Rate: {Math.round(movies[next].vote_average * 10) / 10}</h2>
                <h2 className="text-white text-[14px] ">Vote Count: {movies[next].vote_count}</h2>

              </div>
            </div>
            
            {imageLoading ? (
              <div className=""></div>
            ) : (
              <img
                src={`${baseImageUrl}${movies[next].imagePath}`}
                alt={movies[next]?.title || "Movie Title"}
                onLoad={() => setImageLoading(false)}
                onError={() => setError("Failed to load image")}
                className="w-full object-cover animate__animated animate__fadeIn "
              />
            )}

            <div className="flex items-center absolute bg-gradient-to-r from-[]  backdrop-blur-[2px] z-30 right-0 top-0 h-full">
              <button onClick={handleNext} className="text-white px-4 py-2 rounded">
                <Image src={"/Next.svg"} height={35} width={35} />
              </button>
            </div>

          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}