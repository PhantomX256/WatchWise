import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
  Grid2,
} from "@mui/material";
import { useMovieService } from "../lib/hooks/tmdb";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page") || "1";

  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const { isLoading, error, handleSearchMovies } = useMovieService();

  // Get current page from URL
  const currentPage = parseInt(pageParam, 10);

  // This useEffect has a dependency problem - it needs to run when query or page changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        // Pass both query and page number to the API
        const results = await handleSearchMovies(query, currentPage);
        setSearchResults(results.results || []);
        setTotalPages(results.total_pages || 0);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]); // Fixed dependency array

  // Separate useEffect to handle query change resetting to page 1
  useEffect(() => {
    // Only run this when query changes, not when page changes
    const prevQuery = searchParams.get("prevQuery");

    if (query && prevQuery && query !== prevQuery && currentPage !== 1) {
      setSearchParams({ q: query, page: "1", prevQuery: query });
    } else if (query) {
      // Store current query for comparison on next change
      setSearchParams((prev) => ({
        ...Object.fromEntries(prev.entries()),
        prevQuery: query,
      }));
    }
  }, [query, setSearchParams]);

  // Update URL when page changes
  const handlePageChange = (event, value) => {
    // Update URL with new page number while keeping the same query
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", value.toString());
      return newParams;
    });

    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "rgb(15, 18, 20)",
      }}
    >
      <Container sx={{ pt: 12, pb: 5 }}>
        {/* Search Results Header */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "white", mb: 3 }}
        >
          Search Results for "{query}"
        </Typography>
        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        {/* No Results */}
        {!isLoading && !error && searchResults.length === 0 && query && (
          <Alert severity="info" sx={{ mb: 4 }}>
            No results found for "{query}". Try a different search term.
          </Alert>
        )}
        {/* Search Results Grid */}
        {!isLoading && !error && searchResults.length > 0 && (
          <>
            <Grid2 container spacing={3}>
              {searchResults.map((movie) => (
                <Grid2 xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <Link
                    to={`/movie/${movie.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      key={movie.id}
                      sx={{
                        minWidth: 180,
                        maxWidth: 180,
                        mr: 2,
                        borderRadius: 2,
                        flexShrink: 0,
                        transition: "transform 0.3s",
                        border: "1px solid rgba(28, 34, 38, 1)",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        backgroundColor: "transparent",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="270"
                        image={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title}
                      />
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography
                          variant="subtitle2"
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "white",
                            fontFamily: "Roboto",
                            fontSize: "18px",
                          }}
                        >
                          {movie.title}
                        </Typography>
                        {movie.release_date && (
                          <Typography
                            variant="caption"
                            color="rgb(182, 190, 201);"
                          >
                            {new Date(movie.release_date).getFullYear()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </Grid2>
              ))}
            </Grid2>
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "rgb(182, 190, 201)",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "rgba(58, 105, 172, 0.8) !important",
                      color: "white",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Search;
