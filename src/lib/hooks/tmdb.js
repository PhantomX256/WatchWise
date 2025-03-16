import { useState } from "react";
import {
  getMovieDetails,
  getMoviesByGenre,
  getPopularMovies,
  searchMovie,
} from "../api/tmdb";

export const useMovieService = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  return {
    isLoading,
    error,
    handleGetPopularMovies,
    handleSearchMovies,
    handleGetMoviesByGenre,
    handleGetMovieDetails,
  };
};
