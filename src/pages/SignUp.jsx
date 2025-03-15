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

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");

  // Use the authentication hook
  const { handleSignUp, isLoading, error, clearError } = useAuthService();
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

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormSuccess("");

    if (validate()) {
      try {
        // Use the handleSignUp function from our hook
        await handleSignUp(
          formData.email,
          formData.password,
          formData.fullName
        );

        setFormSuccess("Account created successfully! Redirecting to login...");

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to sign-in page after a delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } catch (err) {
        // Error is handled by the hook and stored in the error state
        console.error("Registration failed:", err);
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
          Create Your Account
        </Typography>
        <Typography
          variant="body2"
          color="rgb(182, 190, 201)"
          align="center"
          sx={{ mb: 4 }}
        >
          Join WatchWise to track your favorite movies and discover new content
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {formSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {formSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formData.fullName}
            onChange={handleChange}
            error={!!localErrors.fullName}
            helperText={localErrors.fullName}
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!localErrors.confirmPassword}
            helperText={localErrors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: "rgb(182, 190, 201)" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="rgb(182, 190, 201)">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/sign-in"
                variant="body2"
                sx={{ color: "#90caf9" }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
