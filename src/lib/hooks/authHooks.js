import { useState, useCallback } from "react";
import { signIn, signUp, logout } from "../firebase/authService";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook to handle authentication operations
 * @returns {Object} Authentication methods and states
 */
export const useAuthService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Clear any previous errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle user sign in
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const handleSignIn = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await signIn(email, password);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user sign up
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User's full name
   * @returns {Promise<Object>} User data
   */
  const handleSignUp = useCallback(async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await signUp(email, password, fullName);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user sign out
   * @returns {Promise<void>}
   */
  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    clearError,
    handleSignIn,
    handleSignUp,
    handleSignOut,
  };
};

export default useAuthService;
