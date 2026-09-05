import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  resendOtp as apiResendOtp,
  verifyEmail as apiVerifyEmail,
  logout as apiLogout,
  logoutAll as apiLogoutAll,
  getCurrentUser,
  isAuthenticated,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    const currentUser = data.user || (await getCurrentUser());
    setUser(currentUser);
    return currentUser;
  };

  const register = async (details) => apiRegister(details);

  const resendOtp = async (details) => apiResendOtp(details);

  const verifyEmail = async ({ email, otp }) => {
    const data = await apiVerifyEmail({ email, otp });
    const currentUser = data.user || (await getCurrentUser());
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    await apiLogout().catch(() => {});
    setUser(null);
    window.location.href = "/login";
  };

  const logoutAll = async () => {
    await apiLogoutAll().catch(() => {});
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, resendOtp, verifyEmail, logout, logoutAll }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
