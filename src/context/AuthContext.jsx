import { createContext, useContext, useEffect, useState } from "react";

import {
  login as apiLogin,
  register as apiRegister,
  resendOtp as apiResendOtp,
  verifyEmail as apiVerifyEmail,
  logout as apiLogout,
  logoutAll as apiLogoutAll,
  getCurrentUser,
  refreshToken as apiRefreshToken,
  isAuthenticated,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session when app starts
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // If there is no access token at all,
        // user is genuinely logged out.
        if (!isAuthenticated()) {
          setUser(null);
          return;
        }

        try {
          // First try current access token
          const data = await getCurrentUser();
          setUser(data.user);
        } catch (error) {
          // Access token may have expired.
          // Try refresh token before logging user out.
          if (error.response?.status === 401) {
            const refreshData = await apiRefreshToken();

            if (refreshData?.accessToken) {
              const currentUser = await getCurrentUser();
              setUser(currentUser.user);
              return;
            }
          }

          // Refresh token also failed
          setUser(null);
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);

    const currentUser =
      data.user || (await getCurrentUser()).user;

    setUser(currentUser);

    return currentUser;
  };

  // Registration only sends OTP.
  // User is logged in after OTP verification.
  const register = async (details) => {
    return apiRegister(details);
  };

  const resendOtp = async (details) => {
    return apiResendOtp(details);
  };

  const verifyEmail = async ({ email, otp }) => {
    const data = await apiVerifyEmail({
      email,
      otp,
    });

    const currentUser =
      data.user || (await getCurrentUser()).user;

    setUser(currentUser);

    return currentUser;
  };

  const refreshUser = async () => {
    try {
      // If no access token exists, don't try to refresh.
      if (!isAuthenticated()) {
        setUser(null);
        return null;
      }

      const data = await getCurrentUser();

      setUser(data.user);

      return data.user;
    } catch (error) {
      // Try refresh token if access token expired.
      if (error.response?.status === 401) {
        try {
          const refreshData = await apiRefreshToken();

          if (refreshData?.accessToken) {
            const data = await getCurrentUser();

            setUser(data.user);

            return data.user;
          }
        } catch (refreshError) {
          console.error(
            "Refresh token failed:",
            refreshError
          );
        }
      }

      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  const logoutAll = async () => {
    try {
      await apiLogoutAll();
    } catch (error) {
      console.error("Logout all error:", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        resendOtp,
        verifyEmail,
        refreshUser,
        logout,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>"
    );
  }

  return ctx;
}