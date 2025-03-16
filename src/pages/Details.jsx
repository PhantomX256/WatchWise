import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovieService } from "../lib/hooks/tmdb";
import {
  Box,
  Container,
  Typography,
  Chip,
  CircularProgress,
  Rating,
  Grid,
  Paper,
  Stack,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  AccessTime,
  CalendarToday,
  Language,
  Star,
} from "@mui/icons-material";

const Details = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { isLoading, error, handleGetMovieDetails } = useMovieService();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        const movieData = await handleGetMovieDetails(id);
        setMovie(movieData);

        // Here you would check if the movie is in the user's watchlist
        // This is a placeholder - replace with your actual watchlist check
        setIsInWatchlist(localStorage.getItem(`watchlist_${id}`) === "true");
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      }
    };

    fetchMovieDetails();
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "rgb(15, 18, 20)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!movie) {
    return null;
  }

  // Format release date
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown release date";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Backdrop image with overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 18, 20, 0.85)", // Dark overlay with 85% opacity
            backdropFilter: "blur(8px)", // Blur effect for the backdrop
          },
          zIndex: -1,
        }}
      />

      {/* Content area with gradient bottom */}
      <Container
        maxWidth="lg"
        sx={{
          pt: 12,
          pb: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid container spacing={4}>
          {/* Movie poster */}
          <Grid item xs={12} md={4} lg={3}>
            <Box
              component="img"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          </Grid>

          {/* Movie details */}
          <Grid item xs={12} md={8} lg={9}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ color: "white", mb: 1, fontWeight: 700 }}
            >
              {movie.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {movie.genres &&
                movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(58, 105, 172, 0.6)",
                      color: "white",
                    }}
                  />
                ))}
            </Stack>

            {/* Rating and year */}
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              {movie.vote_average > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Star sx={{ color: "#FFD700" }} />
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {(movie.vote_average / 2).toFixed(1)}/5
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarToday sx={{ color: "rgb(182, 190, 201)" }} />
                <Typography
                  variant="body1"
                  sx={{ color: "rgb(182, 190, 201)" }}
                >
                  {movie.release_date &&
                    new Date(movie.release_date).getFullYear()}
                </Typography>
              </Stack>

              {movie.runtime > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime sx={{ color: "rgb(182, 190, 201)" }} />
                  <Typography
                    variant="body1"
                    sx={{ color: "rgb(182, 190, 201)" }}
                  >
                    {formatRuntime(movie.runtime)}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Tagline */}
            {movie.tagline && (
              <Typography
                variant="h6"
                sx={{
                  color: "rgb(182, 190, 201)",
                  fontStyle: "italic",
                  mb: 2,
                }}
              >
                "{movie.tagline}"
              </Typography>
            )}

            {/* Overview */}
            <Typography variant="h6" sx={{ color: "white", mt: 2, mb: 1 }}>
              Overview
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgb(182, 190, 201)",
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              {movie.overview || "No overview available"}
            </Typography>

            {/* Action buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
                sx={{
                  backgroundColor: isInWatchlist
                    ? "rgba(58, 105, 172, 0.9)"
                    : "rgba(58, 105, 172, 0.6)",
                  "&:hover": {
                    backgroundColor: isInWatchlist
                      ? "rgba(58, 105, 172, 1)"
                      : "rgba(58, 105, 172, 0.8)",
                  },
                }}
              >
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Details;
