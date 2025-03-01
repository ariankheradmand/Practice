import fetchData from '../../utils/tmdb';
import "../../app/globals.css"
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, Filter, Grid, List, SortAsc, Star, Calendar, TrendingUp } from 'lucide-react';

const SORT_OPTIONS = {
  POPULARITY: 'popularity.desc',
  RATING: 'vote_average.desc',
  DATE: 'release_date.desc',
  TITLE: 'original_title.asc'
};

const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
};

const CATEGORIES = {
  movies: {
    trending: '/trending/movie/week',
    topRated: '/movie/top_rated',
    upcoming: '/movie/upcoming',
    nowPlaying: '/movie/now_playing'
  },
  tv: {
    trending: '/trending/tv/week',
    topRated: '/tv/top_rated',
    popular: '/tv/popular',
    onTheAir: '/tv/on_the_air'
  },
  persons: {
    trending: '/trending/person/week',
    popular: '/person/popular'
  }
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewType, setViewType] = useState(VIEW_TYPES.GRID);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.POPULARITY);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('movies');
  const [subCategory, setSubCategory] = useState('trending');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchData('/genre/movie/list');
        setGenres(data.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Main data fetching function
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = CATEGORIES[category][subCategory];
      let params = { page };

      if (searchQuery) {
        endpoint = category === 'movies' ? '/search/movie' : category === 'tv' ? '/search/tv' : '/search/person';
        params.query = searchQuery;
      }

      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(',');
      }

      if (sortBy && !searchQuery) {
        params.sort_by = sortBy;
      }

      const data = await fetchData(endpoint, params);
      setItems(prevItems => page > 1 ? [...prevItems, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [category, subCategory, page, searchQuery, selectedGenres, sortBy]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchItems();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [fetchItems, searchQuery, category, subCategory, selectedGenres, sortBy]);

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Search and Filters */}
      <header className="mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-medium text-gray-900">Media Gallery</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType(VIEW_TYPES.GRID)}
              className={`p-2 rounded ${viewType === VIEW_TYPES.GRID ? 'bg-gray-200' : 'bg-gray-100'}`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType(VIEW_TYPES.LIST)}
              className={`p-2 rounded ${viewType === VIEW_TYPES.LIST ? 'bg-gray-200' : 'bg-gray-100'}`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="movies">Movies</option>
            <option value="tv">TV Shows</option>
            <option value="persons">Persons</option>
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {category === 'movies' && (
              <>
                <option value="trending">Trending</option>
                <option value="topRated">Top Rated</option>
                <option value="upcoming">Upcoming</option>
                <option value="nowPlaying">Now Playing</option>
              </>
            )}
            {category === 'tv' && (
              <>
                <option value="trending">Trending</option>
                <option value="topRated">Top Rated</option>
                <option value="popular">Popular</option>
                <option value="onTheAir">On The Air</option>
              </>
            )}
            {category === 'persons' && (
              <>
                <option value="trending">Trending</option>
                <option value="popular">Popular</option>
              </>
            )}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={SORT_OPTIONS.POPULARITY}>Popularity</option>
            <option value={SORT_OPTIONS.RATING}>Rating</option>
            <option value={SORT_OPTIONS.DATE}>Release Date</option>
            <option value={SORT_OPTIONS.TITLE}>Title</option>
          </select>

          <div className="relative">
            <button
              onClick={() => document.getElementById('genreFilter').showModal()}
              className="w-full p-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Genre Filter
            </button>
          </div>
        </div>

        {/* Genre Tags */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map(genreId => {
              const genre = genres.find(g => g.id === genreId);
              return (
                <span
                  key={genreId}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
                >
                  {genre?.name}
                  <button
                    onClick={() => handleGenreToggle(genreId)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </header>

      {/* Error State */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchItems()}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Gallery Content */}
      <div className={`
        ${viewType === VIEW_TYPES.GRID 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : 'space-y-4'
        }
      `}>
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`
                group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300
                ${viewType === VIEW_TYPES.LIST ? 'flex gap-4' : ''}
              `}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(item)}
            >
              <div className={`
                bg-gray-200 overflow-hidden
                ${viewType === VIEW_TYPES.LIST ? 'w-48' : 'aspect-[2/3]'}
              `}>
                <img
                  src={category === 'persons' ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : `https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={category === 'persons' ? item.name : item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className={`
                ${viewType === VIEW_TYPES.LIST 
                  ? 'p-4 flex-1'
                  : 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                }
              `}>
                <h3 className={`font-medium truncate ${viewType === VIEW_TYPES.LIST ? 'text-gray-900' : 'text-white'}`}>
                  {category === 'persons' ? item.name : item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className={viewType === VIEW_TYPES.LIST ? 'text-gray-600' : 'text-gray-200'}>
                    {category === 'persons' ? item.popularity.toFixed(1) : item.vote_average.toFixed(1)}
                  </span>
                </div>
                {viewType === VIEW_TYPES.LIST && (
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {category === 'persons' ? item.biography : item.overview}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {!loading && page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal for Detailed View */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full p-6 transform animate-in fade-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={category === 'persons' ? `https://image.tmdb.org/t/p/w1280${selectedItem.profile_path}` : `https://image.tmdb.org/t/p/w1280${selectedItem.backdrop_path}`}
                alt={category === 'persons' ? selectedItem.name : selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h2 id="modal-title" className="text-xl font-medium">
                {category === 'persons' ? selectedItem.name : selectedItem.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{category === 'persons' ? selectedItem.popularity.toFixed(1) : selectedItem.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(category === 'persons' ? selectedItem.birthday : selectedItem.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span>{category === 'persons' ? selectedItem.popularity.toFixed(0) : selectedItem.popularity.toFixed(0)}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                {category === 'persons' ? selectedItem.biography : selectedItem.overview}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter Dialog */}
      <dialog
        id="genreFilter"
        className="p-6 rounded-lg shadow-xl backdrop:bg-black/50 w-full max-w-md"
      >
        <h3 className="text-lg font-medium mb-4">Filter by Genre</h3>
        <div className="grid grid-cols-2 gap-2">
          {genres.map(genre => (
            <label
              key={genre.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreToggle(genre.id)}
                className="rounded"
              />
              {genre.name}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => document.getElementById('genreFilter').close()}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Done
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Gallery;