import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthService } from "../lib/hooks/authHooks";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  // Use the authentication hook
  const { handleSignIn, isLoading, error, clearError } = useAuthService();
  const navigate = useNavigate();

  // Clear API error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user types
    if (localErrors[name]) {
      setLocalErrors({
        ...localErrors,
        [name]: "",
      });
    }

    // Also clear any API errors when user starts typing again
    if (error) {
      clearError();
    }
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (validate()) {
      try {
        // Use the handleSignIn function from our hook
        await handleSignIn(formData.email, formData.password);

        // Navigation will be handled by AuthContext's onAuthStateChanged
        // which will detect the signed-in user and redirect to dashboard
      } catch (err) {
        // Error is handled by the hook and stored in the error state
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          backgroundColor: "rgb(15, 18, 20)",
          border: "1px solid rgb(28, 34, 38)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="white"
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="rgb(182, 190, 201)"
          align="center"
          sx={{ mb: 4 }}
        >
          Sign in to continue to your WatchWise account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!localErrors.email}
            helperText={localErrors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgb(28, 34, 38)",
                },
                "&:hover fieldset": {
                  borderColor: "rgb(82, 88, 98)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgb(182, 190, 201)",
              },
              "& .MuiOutlinedInput-input": {
                color: "white",
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!localErrors.password}
            helperText={localErrors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "rgb(182, 190, 201)" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgb(28, 34, 38)",
                },
                "&:hover fieldset": {
                  borderColor: "rgb(82, 88, 98)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgb(182, 190, 201)",
              },
              "& .MuiOutlinedInput-input": {
                color: "white",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{ color: "#90caf9" }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="rgb(182, 190, 201)">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/sign-up"
                variant="body2"
                sx={{ color: "#90caf9" }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
