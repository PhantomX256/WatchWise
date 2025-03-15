import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const SearchBar = ({ onSubmitSearch, redirectOnSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    if (onSubmitSearch) {
      onSubmitSearch(searchQuery);
    }

    // If redirectOnSearch is false or not provided, we'd show results locally
    // But in this case, we're letting the parent component handle the redirection
    if (!redirectOnSearch) {
      // Any local search logic would go here
    }
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchQuery("");
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
    </Box>
  );
};

export default SearchBar;
