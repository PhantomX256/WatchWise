import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    if (!user) return null;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.warn("No user document found for this user");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const data = await fetchUserData(user);
        setUserData(data);

        // If user is logged in and tries to access auth pages, redirect to dashboard
        if (
          location.pathname === "/" ||
          location.pathname === "/sign-in" ||
          location.pathname === "/sign-up"
        ) {
          navigate("/dashboard");
        }
      } else {
        setCurrentUser(null);
        setUserData(null);

        // If user is not logged in and tries to access protected routes, redirect to home
        const protectedRoutes = ["/dashboard", "/watchlist", "/settings"];
        if (
          protectedRoutes.some((route) => location.pathname.startsWith(route))
        ) {
          navigate("/");
        }
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [auth, navigate, location.pathname]);

  // Update user data when needed (e.g., after watchlist changes)
  const refreshUserData = async () => {
    if (currentUser) {
      const data = await fetchUserData(currentUser);
      setUserData(data);
      return data;
    }
    return null;
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    userData,
    loading,
    refreshUserData,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgb(15, 18, 20)",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
