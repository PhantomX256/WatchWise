import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import {
  ExitToApp as LogoutIcon,
  Bookmarks as WatchlistIcon,
} from "@mui/icons-material";
import useAuthService from "../../lib/hooks/authHooks";
import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const { handleSignOut } = useAuthService();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgb(15, 18, 20)",
        borderBottom: "1px solid rgba(28, 34, 38, 1)",
      }}
    >
      <Container maxWidth="100%">
        <Toolbar>
          {/* Logo/Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "rgb(0, 115, 230)",
            }}
          >
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "rgb(0, 115, 230)" }}
            >
              WatchWise
            </Link>
          </Typography>

          {/* Navigation Items */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Watchlist Button */}
            <Button
              component={Link}
              to="/watchlist"
              startIcon={<WatchlistIcon />}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              Watchlist
            </Button>

            {/* Logout Button */}
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardNavbar;
