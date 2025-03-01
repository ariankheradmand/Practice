import React, { useState, useEffect } from "react";
import "../app/globals.css";
import fetchData from "../utils/tmdb";
import { SECTIONS } from "../utils/constants";

// Import components
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Section from "../components/Section";
import FeaturedArtists from "../components/FeaturedArtists";
import GenresSection from "../components/GenresSection";
import Footer from "../components/Footer";

export default function Home() {
  const [sections, setSections] = useState({});
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch sections data
        const results = {};
        for (const section of SECTIONS) {
          try {
            const data = await fetchData(section.endpoint, {
              language: "en-US",
              page: 1,
            });
            results[section.id] = data.results;
          } catch (error) {
            console.error(`Error fetching ${section.id}:`, error);
          }
        }

        // Fetch artists data
        let artistsData = [];
        try {
          const data = await fetchData("/person/popular", {
            language: "en-US",
            page: 1,
          });
          artistsData = data.results.slice(0, 6);
        } catch (error) {
          console.error("Error fetching artists:", error);
        }

        // Fetch genres data
        let genresData = [];
        try {
          const data = await fetchData("/genre/movie/list", {
            language: "en-US",
          });
          genresData = data.genres.slice(0, 12);
        } catch (error) {
          console.error("Error fetching genres:", error);
        }

        // Update state
        setSections(results);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-xl">Loading amazing content...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state with all sections
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Main sections - first 3 */}
        {SECTIONS.slice(0, 3).map(
          (section) =>
            sections[section.id] &&
            sections[section.id].length > 0 && (
              <Section
                key={section.id}
                title={section.title}
                icon={section.icon}
                color={section.color}
                items={sections[section.id]}
                type={section.id.includes("tv") ? "tv" : "movie"}
                sectionId={section.id}
              />
            )
        )}

        {/* Genres section */}
        {genres && genres.length > 0 && <GenresSection genres={genres} />}

        {/* Featured Artists */}
        {artists.length > 0 && <FeaturedArtists artists={artists} />}

        {/* More sections */}
        {SECTIONS.slice(3).map(
          (section) =>
            sections[section.id] &&
            sections[section.id].length > 0 && (
              <Section
                key={section.id}
                title={section.title}
                icon={section.icon}
                color={section.color}
                items={sections[section.id]}
                type={section.id.includes("tv") ? "tv" : "movie"}
                sectionId={section.id}
              />
            )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
