import { createContext, useContext, useState, useEffect } from "react";

// Create watchlist context
const WatchlistContext = createContext();

// Provider component
export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load watchlist from localStorage when component mounts
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const savedWatchlist = localStorage.getItem("watchlist");
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        setWatchlist([]);
      } finally {
        setIsInitialized(true);
      }
    };

    loadWatchlist();

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (e) => {
      if (e.key === "watchlist") {
        loadWatchlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isInitialized]);

  // Add item to watchlist
  const addToWatchlist = (item) => {
    // Make sure the item has a media_type
    if (!item.media_type) {
      console.error("Item must have a media_type property");
      return;
    }

    setWatchlist((prevWatchlist) => {
      // Check if item already exists in watchlist
      const exists = prevWatchlist.some(
        (watchlistItem) =>
          watchlistItem.id === item.id &&
          watchlistItem.media_type === item.media_type
      );

      if (exists) {
        return prevWatchlist;
      }

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"));

      return [...prevWatchlist, item];
    });
  };

  // Remove item from watchlist
  const removeFromWatchlist = (id, mediaType) => {
    setWatchlist((prevWatchlist) => {
      const newWatchlist = prevWatchlist.filter(
        (item) => !(item.id === id && item.media_type === mediaType)
      );

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"));

      return newWatchlist;
    });
  };

  // Check if an item is in the watchlist
  const isInWatchlist = (id, mediaType) => {
    return watchlist.some(
      (item) => item.id === id && item.media_type === mediaType
    );
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        count: watchlist.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook to use the watchlist context
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};

export default WatchlistContext;
