import { useState } from "react";
import {
  getWatchLists,
  createWatchlist,
  getWatchListDetails,
} from "../firebase/watchlistService";

export const useWatchListService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetWatchlists = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const watchlists = await getWatchLists();
      setIsLoading(false);
      return watchlists;
    } catch (err) {
      setError(err.message || "Failed to fetch watchlists");
      setIsLoading(false);
      throw err;
    }
  };

  const handleCreateWatchlist = async (watchlistData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newWatchlist = await createWatchlist(watchlistData);
      setIsLoading(false);
      return newWatchlist;
    } catch (err) {
      setError(err.message || "Failed to create watchlist");
      setIsLoading(false);
      throw err;
    }
  };

  const handleGetWatchlistDetails = async (watchlistId) => {
    setIsLoading(true);
    setError(null);

    try {
      const watchlistDetails = await getWatchListDetails(watchlistId);
      setIsLoading(false);
      return watchlistDetails;
    } catch (err) {
      setError(err.message || "Failed to fetch watchlist details");
      setIsLoading(false);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    handleGetWatchlists,
    handleCreateWatchlist,
    handleGetWatchlistDetails,
  };
};
