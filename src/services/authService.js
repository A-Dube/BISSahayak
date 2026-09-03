import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-fkpu.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ fullName, email, password }) {
  const { data } = await api.post("/auth/register", {
    username: fullName,
    email,
    password,
  });

  if (data?.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function resendOtp({ fullName, email, password }) {
  const { data } = await api.post("/auth/register", {
    username: fullName,
    email,
    password,
  });
  return data;
}

export async function verifyEmail({ email, otp }) {
  const { data } = await api.post("/auth/verify-email", { email, otp });
  if (data?.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/get-me");
  return data;
}

export async function refreshToken() {
  const { data } = await api.post("/auth/refresh-token");
  if (data?.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
  localStorage.removeItem("bis_access_token");
}

export async function logoutAll() {
  await api.post("/auth/logout-all");
  localStorage.removeItem("bis_access_token");
}

export function getToken() {
  return localStorage.getItem("bis_access_token");
}

export function isAuthenticated() {
  return !!getToken();
}

export default api;