import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieService } from "../lib/hooks/tmdb";
import {
  Box,
  Container,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  DialogActions,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  AccessTime,
  CalendarToday,
  Star,
  Add,
  Close,
  Movie,
} from "@mui/icons-material";
import WatchProviderList from "../components/ui/WatchProviderList";
import { useWatchListService } from "../lib/hooks/watchlistHooks";

const Details = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const {
    isLoading,
    error,
    handleGetMovieDetails,
    isRecommendationLoading,
    handleGetMovieRecommendations,
  } = useMovieService();
  const {
    isLoading: watchlistLoading,
    error: watchlistError,
    handleGetWatchlists,
    handleAddMovieToWatchlist,
  } = useWatchListService();

  // New state for watchlist dialog
  const [watchlistDialogOpen, setWatchlistDialogOpen] = useState(false);
  const [userWatchlists, setUserWatchlists] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        const movieData = await handleGetMovieDetails(id);
        setMovie(movieData);

        // Fetch recommendations
        const recommendedMovies = await handleGetMovieRecommendations(id);
        setRecommendations(recommendedMovies);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      }
    };

    fetchMovieDetails();
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Handle opening the watchlist dialog
  const handleOpenWatchlistDialog = async () => {
    setWatchlistDialogOpen(true);
    try {
      const watchlists = await handleGetWatchlists();
      setUserWatchlists(watchlists);
    } catch (err) {
      console.error("Error loading watchlists:", err);
      setSnackbarMessage("Failed to load your watchlists");
      setSnackbarOpen(true);
    }
  };

  // Add movie to watchlist
  const handleAddToWatchlist = async (watchlistId) => {
    try {
      await handleAddMovieToWatchlist(id, watchlistId);
      setIsInWatchlist(true); // Only set to true when added in current session
      setWatchlistDialogOpen(false);
      setSnackbarMessage("Movie added to watchlist!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(err.message || "Failed to add movie to watchlist");
      setSnackbarOpen(true);
    }
  };

  // Handle closing dialog
  const handleCloseWatchlistDialog = () => {
    setWatchlistDialogOpen(false);
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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
        backgroundColor: "rgb(15, 18, 20)",
      }}
    >
      {/* Backdrop image with overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
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
          zIndex: 1,
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
                onClick={handleOpenWatchlistDialog}
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
                {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Watch Providers Section */}
        <Box sx={{ mt: 5 }}>
          <WatchProviderList movieId={id} countryCode="IN" />
        </Box>

        {/* Recommendations Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ color: "white", mb: 3, fontWeight: 600 }}
          >
            You Might Also Like
          </Typography>

          {isRecommendationLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : recommendations && recommendations.length > 0 ? (
            <Grid container spacing={2}>
              {recommendations.slice(0, 6).map((movie) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
                  <Box
                    component={Link}
                    to={`/movie/${movie.id}`}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "150%",
                        borderRadius: 1,
                        overflow: "hidden",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                        mb: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={movie.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 500,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {movie.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{ color: "rgb(182, 190, 201)", textAlign: "center", py: 4 }}
            >
              No recommendations available for this movie.
            </Typography>
          )}
        </Box>
        <Dialog
          open={watchlistDialogOpen}
          onClose={handleCloseWatchlistDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ bgcolor: "rgb(25, 28, 30)", color: "white" }}>
            Add to Watchlist
            <IconButton
              onClick={handleCloseWatchlistDialog}
              sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ bgcolor: "rgb(25, 28, 30)", pt: 2 }}>
            {watchlistLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : watchlistError ? (
              <Alert severity="error">{watchlistError}</Alert>
            ) : userWatchlists.length === 0 ? (
              <Typography sx={{ color: "rgb(182, 190, 201)", py: 2 }}>
                You don't have any watchlists yet. Create one from the Watchlist
                page.
              </Typography>
            ) : (
              <List sx={{ pt: 0 }}>
                {userWatchlists.map((list) => (
                  <ListItem
                    key={list.id}
                    disableGutters
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleAddToWatchlist(list.id)}
                        sx={{ color: "rgb(58, 105, 172)" }}
                      >
                        <Add />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      p: 1,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "rgba(58, 105, 172, 0.8)" }}>
                        <Movie />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={list.title}
                      secondary={`${list.movies?.length || 0} movies`}
                      primaryTypographyProps={{ color: "white" }}
                      secondaryTypographyProps={{ color: "rgb(182, 190, 201)" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: "rgb(25, 28, 30)", px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseWatchlistDialog}
              sx={{ color: "rgb(182, 190, 201)" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        />
      </Container>
    </Box>
  );
};

export default Details;
