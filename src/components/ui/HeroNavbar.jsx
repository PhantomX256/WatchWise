import { Button, Stack } from "@mui/material";

const HeroNavbar = () => {
  return (
    <div className="navbar-container">
      <h1>WatchWise</h1>
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Sign Up</Button>
        <Button variant="outlined">Log In</Button>
      </Stack>
    </div>
  );
};

export default HeroNavbar;
