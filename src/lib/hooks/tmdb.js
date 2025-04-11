import { useState } from "react";
import {
  getMovieDetails,
  getMoviesByGenre,
  getPopularMovies,
  getRecommendedMovies,
  getWatchListMovies,
  getWatchProviders,
  searchMovie,
} from "../api/tmdb";

export const useMovieService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const movies = await getPopularMovies();
      return movies;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchMovies = async (query, page) => {
    try {
      setIsLoading(true);
      setError(null);
      const movies = await searchMovie(query, page);
      return movies;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMoviesByGenre = async (genres, page) => {
    try {
      setIsLoading(true);
      setError(null);
      const movies = await getMoviesByGenre(genres, page);
      return movies;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMovieDetails = async (movieId) => {
    try {
      setIsLoading(true);
      setError(null);
      const movieDetails = await getMovieDetails(movieId);
      return movieDetails;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetWatchProviders = async (movieId) => {
    try {
      setIsLoading(true);
      setError(null);
      const watchProviders = await getWatchProviders(movieId);
      return watchProviders;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetWatchListMovies = async (movieIds) => {
    try {
      setIsLoading(true);
      setError(null);
      const movies = await getWatchListMovies(movieIds);
      return movies;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMovieRecommendations = async (movieId) => {
    try {
      setIsRecommendationLoading(true);
      setError(null);
      const recommendations = await getRecommendedMovies(movieId);
      return recommendations;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  return {
    isLoading,
    isRecommendationLoading,
    error,
    handleGetPopularMovies,
    handleSearchMovies,
    handleGetMoviesByGenre,
    handleGetMovieDetails,
    handleGetWatchProviders,
    handleGetWatchListMovies,
    handleGetMovieRecommendations,
  };
};
