import axios from "axios";

const token = import.meta.env.VITE_ACCESS_TOKEN;
if (!token) throw new Error("No access token provided");

export const getPopularMovies = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchMovie = async (query, page) => {
  if (!query) {
    throw new Error("Search query is required");
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to search movies");
  }
};

export const getMoviesByGenre = async (genres, page = 1) => {
  try {
    // Convert genres array to comma-separated string if it's an array
    const genreParam = Array.isArray(genres) ? genres.join(",") : genres;

    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          include_adult: false,
          include_video: false,
          language: "en-US",
          page: page,
          sort_by: "popularity.desc",
          with_genres: genreParam,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to get movies by genre");
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
