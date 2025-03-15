import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { ExitToApp as LogoutIcon } from "@mui/icons-material";
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
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              WatchWise
            </Link>
          </Typography>

          {/* Logout Button */}
          <Button startIcon={<LogoutIcon />} onClick={handleSignOut}>
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardNavbar;
