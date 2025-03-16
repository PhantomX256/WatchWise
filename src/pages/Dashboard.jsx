import React, { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../lib/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/shared/SearchBar";
import ScrollableBar from "../components/shared/ScrollableBar";
import GenreScrollableBar from "../components/ui/GenreScrollableBar";
import { useMovieService } from "../lib/hooks/tmdb";
import { genres } from "../lib/constants/index";

const Dashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState([]);
  const { isLoading, error, handleGetPopularMovies } = useMovieService();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const movies = await handleGetPopularMovies();
        setPopularMovies(movies);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    fetchPopularMovies();
  }, [setPopularMovies]);

  // Function to handle search submission and redirect
  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      // Navigate to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "rgb(15, 18, 20)",
      }}
    >
      {/* Main Dashboard Content */}
      <Container maxWidth="100%" sx={{ pt: 12, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "white" }}
        >
          Welcome, {userData?.fullName || "User"}!
        </Typography>

        {/* Search Box */}
        <Box
          sx={{
            backgroundColor: "rgb(22, 26, 30)",
            borderRadius: 2,
            p: 3,
            border: "1px solid rgb(28, 34, 38)",
            mt: 3,
            mb: 5,
            color: "rgb(182, 190, 201)",
          }}
        >
          <SearchBar onSubmitSearch={handleSearchSubmit} redirectOnSearch />
        </Box>

        {/* Popular Movies Section */}
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
              Top 10 movies this week
            </h3>
            <p
              style={{
                fontFamily: "Roboto",
                fontSize: "16px",
                color: "rgb(182, 190, 201)",
              }}
            >
              Check out this week's most popular movies and find out where to
              watch them.
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
            ) : (
              <ScrollableBar movies={popularMovies} />
            )}
          </div>
        </div>

        {genres.map((genre) => (
          <GenreScrollableBar key={genre.id} genre={genre} />
        ))}
      </Container>
    </Box>
  );
};

export default Dashboard;
