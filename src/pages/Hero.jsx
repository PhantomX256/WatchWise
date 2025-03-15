import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import HeroNavbar from "../components/ui/HeroNavbar";
import all_in_one from "/all_in_one.png";
import one_search from "/one_search.png";
import one_watchlist from "/one_watchlist.png";
import { useMovieService } from "../lib/hooks/tmdb";
import { useEffect, useState } from "react";
import ScrollableBar from "../components/shared/ScrollableBar";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const { isLoading, error, handleGetPopularMovies } = useMovieService();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const movies = await handleGetPopularMovies();
      setPopularMovies(movies);
      console.log(movies);
    };

    fetchPopularMovies();
  }, []);

  useEffect(() => {
    if (error) setOpenSnackbar(true);
  }, [error]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="hero-page">
      <HeroNavbar />
      <h2>Your streaming guide for movies</h2>
      <p>Find where to stream new, popular & upcoming movies with WatchWise.</p>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          sx={{ padding: "10px 25px", fontSize: "20px" }}
          onClick={() => navigate("/sign-up")}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ padding: "10px 25px", fontSize: "20px" }}
          onClick={() => navigate("/sign-in")}
        >
          Log In
        </Button>
      </Stack>
      <Stack
        direction="row"
        spacing={6}
        sx={{ marginTop: "250px", marginBottom: "100px" }}
      >
        <Card
          sx={{
            maxWidth: 300,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
            minHeight: 450,
            borderRadius: 3,
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="200" image={all_in_one} />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "rgb(182, 190, 201)",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                ALL IN ONE PLACE
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "25px",
                  fontWeight: "500",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                The complete streaming guide
              </Typography>
              <Typography
                sx={{
                  color: "rgb(182, 190, 201)",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
                variant="h5"
                component="div"
              >
                Get personal recommendations for all your favorite streaming
                services. We’ll show you where to watch movies, TV shows &
                sports.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          sx={{
            maxWidth: 300,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
            borderRadius: 3,
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="200" image={one_search} />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "rgb(182, 190, 201)",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                ONE SEARCH
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "25px",
                  fontWeight: "500",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                Every platform in one search
              </Typography>
              <Typography
                sx={{
                  color: "rgb(182, 190, 201)",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
                variant="h5"
                component="div"
              >
                Never go back-and-forth between streaming services again to see
                if a movie or TV show is available. We’ve got you covered with
                one search.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          sx={{
            maxWidth: 300,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
            borderRadius: 3,
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="200" image={one_watchlist} />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "rgb(182, 190, 201)",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                ONE WATCHLIST
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "25px",
                  fontWeight: "500",
                  marginBottom: "15px",
                }}
                variant="h5"
                component="div"
              >
                Combine all your watchlists
              </Typography>
              <Typography
                sx={{
                  color: "rgb(182, 190, 201)",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
                variant="h5"
                component="div"
              >
                Create a single watchlist with every movie and TV show you want
                to watch – covering every streaming service in one list across
                all your devices.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
      <div className="popular-movies-container">
        <h2>Browse new, popular and upcoming movies</h2>
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
              }}
            >
              Top 10 movies this week
            </h3>
            <p style={{ fontFamily: "Roboto", fontSize: "16px" }}>
              Check out this week’s most popular movies and find out where to
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
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error ? error : "Failed to load popular movies"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Hero;
