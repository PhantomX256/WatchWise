import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import HeroNavbar from "../components/ui/HeroNavbar";
import all_in_one from "/all_in_one.png";
import one_search from "/one_search.png";
import one_watchlist from "/one_watchlist.png";

const Hero = () => {
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
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ padding: "10px 25px", fontSize: "20px" }}
        >
          Log In
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ marginTop: "250px", marginBottom: "100px" }}>
        <Card
          sx={{
            maxWidth: 350,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="140" image={all_in_one} />
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
            maxWidth: 350,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="140" image={one_search} />
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
            maxWidth: 350,
            backgroundColor: "rgb(15, 18, 20)",
            border: "1px solid rgb(28, 34, 38)",
            cursor: "default",
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="140" image={one_watchlist} />
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
                Create a single watchlist with every movie and TV show you want to watch – covering every streaming service in one list across all your devices.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </div>
  );
};

export default Hero;
