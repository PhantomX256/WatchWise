import React, { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import ScrollableBar from "../shared/ScrollableBar";
import { useMovieService } from "../../lib/hooks/tmdb";

const GenreScrollableBar = ({ genre }) => {
  const [genreMovies, setGenreMovies] = useState([]);
  const { isLoading, error, handleGetMoviesByGenre } = useMovieService();

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const response = await handleGetMoviesByGenre(genre.id, 1); // Only fetch first page
        if (response && response.results) {
          setGenreMovies(response.results);
        }
      } catch (error) {
        console.error(`Failed to fetch ${genre.titel} movies:`, error);
      }
    };

    if (genre) {
      fetchGenreMovies();
    }
  }, [genre, setGenreMovies]);

  return (
    <div
      style={{
        display: "flex",
        marginTop: "60px",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "200px",
          flex: 1,
          height: "340px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <h3
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            color: "white",
          }}
        >
          {genre.heading || "Genre"}
        </h3>
        <p
          style={{
            fontFamily: "Roboto",
            fontSize: "16px",
            color: "rgb(182, 190, 201)",
          }}
        >
          {error
            ? `Error loading ${genre.title} movies: ${error}`
            : genre.subheading}
        </p>
      </div>
      <div style={{ width: "90%" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : genreMovies.length > 0 ? (
          <ScrollableBar movies={genreMovies} />
        ) : (
          <Typography
            style={{
              fontFamily: "Roboto",
              fontSize: "16px",
              color: "rgb(182, 190, 201)",
              textAlign: "center",
              width: "100%",
              padding: "40px 0",
            }}
          >
            No movies found for this genre.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default GenreScrollableBar;
