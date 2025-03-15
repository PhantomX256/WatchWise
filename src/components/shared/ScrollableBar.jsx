import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PropTypes from "prop-types";

const ScrollableBar = ({ movies, title, scrollAmount = 500 }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= scrollAmount;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", my: 4 }}>
      {title && (
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          {title}
        </Typography>
      )}

      <Box sx={{ position: "relative", width: "100%" }}>
        {showLeftArrow && (
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
            }}
            size="large"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {showRightArrow && (
          <IconButton
            onClick={scrollRight}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
            }}
            size="large"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            px: 1,
            py: 2,
          }}
        >
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
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
                    <Typography variant="caption" color="rgb(182, 190, 201);">
                      {new Date(movie.release_date).getFullYear()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No movies to display
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

ScrollableBar.propTypes = {
  movies: PropTypes.array.isRequired,
  title: PropTypes.string,
  scrollAmount: PropTypes.number,
};

export default ScrollableBar;
