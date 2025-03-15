import { useState } from "react";
import { getPopularMovies } from "../api/tmdb";

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

  return { isLoading, error, handleGetPopularMovies };
};
