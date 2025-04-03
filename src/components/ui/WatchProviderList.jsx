import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Link,
  Tooltip,
} from "@mui/material";
import { useMovieService } from "../../lib/hooks/tmdb";

const WatchProviderList = ({ movieId, countryCode = "IN" }) => {
  const [providers, setProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
    free: [],
  });
  const { isLoading, error, handleGetWatchProviders } = useMovieService();
  const [providerLink, setProviderLink] = useState("");

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        const data = await handleGetWatchProviders(movieId);

        // Look for providers in the specified country
        if (data && data.results && data.results[countryCode]) {
          const countryProviders = data.results[countryCode];
          setProviders({
            flatrate: countryProviders.flatrate || [],
            rent: countryProviders.rent || [],
            buy: countryProviders.buy || [],
            free: countryProviders.free || [],
          });

          // Set provider link if available
          if (countryProviders.link) {
            setProviderLink(countryProviders.link);
          }
        }
      } catch (err) {
        console.error("Failed to fetch watch providers:", err);
      }
    };

    fetchWatchProviders();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  // Check if we have any providers
  const hasProviders =
    providers.flatrate.length > 0 ||
    providers.rent.length > 0 ||
    providers.buy.length > 0 ||
    providers.free.length > 0;

  if (!hasProviders) {
    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ color: "rgb(182, 190, 201)" }}>
          No streaming information available for this movie in {countryCode}.
        </Typography>
      </Box>
    );
  }

  const renderProviderSection = (title, providerList) => {
    if (!providerList || providerList.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
          {title}
        </Typography>
        <Grid container spacing={1}>
          {providerList.map((provider) => (
            <Grid item key={provider.provider_id} xs={4} sm={3} md={2} lg={1.5}>
              <Tooltip title={`Watch on ${provider.provider_name}`}>
                <Card
                  component={Link}
                  href={providerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    textDecoration: "none",
                    display: "block",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "contain",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      mb: 1,
                      margin: "0 auto",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgb(182, 190, 201)",
                      display: "block",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "70px",
                      margin: "0 auto",
                    }}
                  >
                    {provider.provider_name}
                  </Typography>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" sx={{ color: "white", mb: 2, fontWeight: 500 }}>
        Where to Watch
      </Typography>
      <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

      {renderProviderSection("Stream", providers.flatrate)}
      {renderProviderSection("Free", providers.free)}
      {renderProviderSection("Rent", providers.rent)}
      {renderProviderSection("Buy", providers.buy)}
    </Box>
  );
};

export default WatchProviderList;
