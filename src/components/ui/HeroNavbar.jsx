import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar-container">
      <h1>WatchWise</h1>
      <Stack direction="row" spacing={2}>
        <Button onClick={() => navigate("/sign-up")} variant="contained">
          Sign Up
        </Button>
        <Button onClick={() => navigate("/sign-in")} variant="outlined">
          Log In
        </Button>
      </Stack>
    </div>
  );
};

export default HeroNavbar;
