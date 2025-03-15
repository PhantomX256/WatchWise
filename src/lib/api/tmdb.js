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
