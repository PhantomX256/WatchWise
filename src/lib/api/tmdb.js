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
