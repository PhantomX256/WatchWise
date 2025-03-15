import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Mock search - will be replaced with actual API call later
    setSearching(true);

    // Simulate API request with timeout
    setTimeout(() => {
      // This is just placeholder data - will be replaced with API results
      const mockResults = [
        { id: 1, title: "The Shawshank Redemption", year: 1994 },
        { id: 2, title: "The Godfather", year: 1972 },
        { id: 3, title: "The Dark Knight", year: 2008 },
      ].filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(mockResults);
      setSearching(false);
    }, 500);
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
        Movie Search
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "rgb(182, 190, 201)" }}>
        Search for movies to add to your watchlist or explore new titles.
      </Typography>

      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for movies by title, actor, or director..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgb(182, 190, 201)" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleClearSearch}
                  sx={{ color: "rgb(182, 190, 201)" }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              "& fieldset": {
                borderColor: "rgb(38, 45, 52)",
              },
              "&:hover fieldset": {
                borderColor: "rgb(58, 65, 72)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgb(58, 105, 172)",
              },
            },
          }}
          sx={{
            "& .MuiInputLabel-root": {
              color: "rgb(182, 190, 201)",
            },
          }}
        />
      </Box>

      {/* Search Results */}
      <Box sx={{ mt: 2 }}>
        {searching ? (
          <Typography
            variant="body1"
            sx={{ color: "rgb(182, 190, 201)", fontStyle: "italic" }}
          >
            Searching...
          </Typography>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "rgb(182, 190, 201)" }}
                >
                  Found {searchResults.length} results for "{searchQuery}"
                </Typography>
                <Divider
                  sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }}
                />
                <Grid container spacing={2}>
                  {searchResults.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: 1,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography variant="h6" sx={{ color: "white" }}>
                          {movie.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgb(182, 190, 201)" }}
                        >
                          {movie.year}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : searchQuery && !searching ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "rgb(182, 190, 201)" }}
                >
                  No results found for "{searchQuery}"
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgb(130, 140, 150)", mt: 1 }}
                >
                  Try a different search term or browse popular movies below.
                </Typography>
              </Box>
            ) : null}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;
