// PopularMovies.js
import React, { useEffect, useState } from "react";
import fetchData from "../utils/tmdb";
import Image from "next/image";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [images, setImages] = useState({}); // Changed to store all images
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
        setMovies(data.results || []);
      } catch (err) {
        setError("Failed to load popular movies");
        setImageLoading(false); // Stop loading if there's an error
      }
    };
    getPopularMovies();

  }, []);

  useEffect(() => {
    const fetchAllImages = async () => {
      const newImages = {};
      setImageLoading(true);
      
      for (let movie of movies) {
        try {
          const data = await fetchData(`/movie/${movie.id}/images`, {
            language: null,
            page: null,
          });
          newImages[movie.id] = data.backdrops[0]?.file_path || "";
        } catch (err) {
          console.error(`Failed to load image for movie ${movie.id}`);
        }
      }

      setImages(newImages);
      setImageLoading(false);
    };

    if (movies.length > 0) {
      fetchAllImages();
    }
  }, [movies]);

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
      <div className="w-11/12 lg:w-7/12 md:w-8/12 h-[193px] md:h-[288px] xl:h-[624px] rounded-t-xl overflow-hidden rounded-xl shadow-lg relative">
        {movies.length > 0 ? (
          <div key={movies[next].id}>

            <div className="flex items-center absolute bg-gradient-to-l from-black/5 to-white/30 z-30 left-0 top-0 h-full">
              <button onClick={handlePrev} className="text-white px-4 py-2 rounded">
                <Image className="rotate-180" src={"/Next.svg"} height={35} width={35} />
              </button>
            </div>
             
            {/* Title */}

            <div className="flex items-center justify-center absolute bottom-0 left-0 w-full z-20">
                <h2 className="text-white">{movies[next].title}</h2>
            </div>
            
            
            {imageLoading ? (
              <div className="h-[193px] md:h-[288px] xl:h-[624px] w-full "></div>
            ) : (
              <img
                src={`${baseImageUrl}${images[movies[next].id] || ''}`}
                alt={movies[next]?.title || "Movie Title"}
                onError={() => setError("Failed to load image")}
                className="w-full object-cover animate__animated animate__fadeIn"
              />
            )}
            


            <div className="flex items-center absolute bg-gradient-to-r from-black/5 to-white/30 z-30 right-0 top-0 h-full">
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