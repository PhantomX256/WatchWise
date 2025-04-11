import { useState } from "react";
import {
  createWatchlist,
  getWatchLists,
  getWatchListDetails,
  addMovieToWatchlist,
  addMemberToWatchlist,
} from "../firebase/watchlistService";

export const useWatchListService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define all handler functions first before using any of them
  const handleCreateWatchlist = async (watchlistData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createWatchlist(watchlistData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const handleGetWatchlists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const watchlists = await getWatchLists();
      setIsLoading(false);
      return watchlists;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const handleGetWatchlistDetails = async (watchlistId) => {
    setIsLoading(true);
    setError(null);
    try {
      const watchlist = await getWatchListDetails(watchlistId);
      setIsLoading(false);
      return watchlist;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const handleAddMovieToWatchlist = async (movieId, watchlistId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await addMovieToWatchlist(movieId, watchlistId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const handleAddMemberToWatchlist = async (userId, watchlistId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await addMemberToWatchlist(userId, watchlistId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Return all handler functions
  return {
    isLoading,
    error,
    handleCreateWatchlist,
    handleGetWatchlists,
    handleGetWatchlistDetails,
    handleAddMovieToWatchlist,
    handleAddMemberToWatchlist,
  };
};
