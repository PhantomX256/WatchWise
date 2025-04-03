import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import {
  Star,
  CalendarToday,
  Add as AddIcon,
  People as PeopleIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import { useWatchListService } from "../lib/hooks/watchlistHooks";
import { useMovieService } from "../lib/hooks/tmdb";

const WatchlistDetails = () => {
  const { id } = useParams();
  const {
    isLoading: isLoadingWatchlist,
    error: watchlistError,
    handleGetWatchlistDetails,
  } = useWatchListService();
  const {
    isLoading: isLoadingMovies,
    error: moviesError,
    handleGetWatchListMovies,
  } = useMovieService();

  const [watchlist, setWatchlist] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      try {
        const watchlistData = await handleGetWatchlistDetails(id);
        setWatchlist(watchlistData);

        // Fetch movie details if the watchlist has movies
        if (watchlistData.movies && watchlistData.movies.length > 0) {
          const movieDetails = await handleGetWatchListMovies(
            watchlistData.movies
          );
          setMovies(movieDetails);
        }
      } catch (err) {
        console.error("Failed to fetch watchlist details:", err);
      }

      console.log(watchlist);
    };

    if (id) {
      fetchWatchlistDetails();
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const isLoading = isLoadingWatchlist || isLoadingMovies;
  const error = watchlistError || moviesError;

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
          backgroundColor: "rgb(15, 18, 20)",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: "500px" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!watchlist) {
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
        <Typography variant="h6" sx={{ color: "white" }}>
          Watchlist not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "rgb(15, 18, 20)" }}>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Watchlist Header */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: "white" }}
            >
              {watchlist.title}
            </Typography>
            <Box sx={{ display: "flex", mt: 1 }}>
              <Chip
                icon={<PeopleIcon sx={{ color: "rgb(182, 190, 201)" }} />}
                label={`${watchlist.memberDetails?.length || 0} Members`}
                sx={{
                  mr: 2,
                  bgcolor: "rgba(58, 105, 172, 0.3)",
                  color: "rgb(182, 190, 201)",
                }}
              />
              <Chip
                icon={<MovieIcon sx={{ color: "rgb(182, 190, 201)" }} />}
                label={`${watchlist.movies?.length || 0} Movies`}
                sx={{
                  bgcolor: "rgba(58, 105, 172, 0.3)",
                  color: "rgb(182, 190, 201)",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Movies List - Center Column */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                bgcolor: "rgba(28, 34, 38, 0.6)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  Movies
                </Typography>
              </Box>

              {movies.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <MovieIcon
                    sx={{
                      fontSize: 60,
                      color: "rgba(58, 105, 172, 0.7)",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "rgb(182, 190, 201)", mb: 2 }}
                  >
                    No movies in this watchlist yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {movies.map((movie, index) => (
                    <React.Fragment key={movie.id}>
                      <ListItem
                        component={Link}
                        to={`/movie/${movie.id}`}
                        sx={{
                          display: "flex",
                          p: 0,
                          textDecoration: "none",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            p: 2,
                          }}
                        >
                          {/* Movie Poster */}
                          <CardMedia
                            component="img"
                            image={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                : "https://via.placeholder.com/200x300?text=No+Image"
                            }
                            alt={movie.title}
                            sx={{
                              width: 80,
                              height: 120,
                              borderRadius: 1,
                              mr: 2,
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                            }}
                          />

                          {/* Movie Details */}
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ color: "white", mb: 1 }}
                            >
                              {movie.title}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              {movie.vote_average > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mr: 2,
                                  }}
                                >
                                  <Star
                                    sx={{
                                      color: "#FFD700",
                                      fontSize: 18,
                                      mr: 0.5,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "white" }}
                                  >
                                    {(movie.vote_average / 2).toFixed(1)}/5
                                  </Typography>
                                </Box>
                              )}

                              {movie.release_date && (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <CalendarToday
                                    sx={{
                                      color: "rgb(182, 190, 201)",
                                      fontSize: 18,
                                      mr: 0.5,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "rgb(182, 190, 201)" }}
                                  >
                                    {new Date(movie.release_date).getFullYear()}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {movie.genres &&
                                movie.genres.slice(0, 3).map((genre) => (
                                  <Chip
                                    key={genre.id}
                                    label={genre.name}
                                    size="small"
                                    sx={{
                                      bgcolor: "rgba(58, 105, 172, 0.3)",
                                      color: "rgb(182, 190, 201)",
                                      height: 24,
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                ))}
                            </Box>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < movies.length - 1 && (
                        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Members List - Right Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(28, 34, 38, 0.6)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  Members
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {watchlist.memberDetails?.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        {member.photoURL ? (
                          <Avatar src={member.photoURL} alt={member.name} />
                        ) : (
                          <Avatar sx={{ bgcolor: "rgba(58, 105, 172, 0.8)" }}>
                            {member.name.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ color: "white" }}>
                            {member.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: "rgb(182, 190, 201)" }}
                          >
                            {member.id === watchlist.createdBy
                              ? "Owner"
                              : "Member"}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < watchlist.memberDetails.length - 1 && (
                      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }} />
                    )}
                  </React.Fragment>
                ))}
              </List>

              <Box
                sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    color: "rgb(58, 105, 172)",
                    borderColor: "rgba(58, 105, 172, 0.5)",
                    "&:hover": {
                      borderColor: "rgb(58, 105, 172)",
                      backgroundColor: "rgba(58, 105, 172, 0.08)",
                    },
                  }}
                >
                  Add Member
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WatchlistDetails;
