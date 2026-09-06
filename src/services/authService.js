import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-fkpu.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
});

export function getToken() {
  return localStorage.getItem("bis_access_token");
}

export function isAuthenticated() {
  return !!getToken();
}

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(resolve, reject) {
  refreshSubscribers.push({ resolve, reject });
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
  refreshSubscribers = [];
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(resolve, reject);
      }).then((newToken) => {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const refreshCall = async () => {
        try {
          return await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
        } catch {
          return await axios.get(`${API_BASE_URL}/auth/refresh-token`, {
            withCredentials: true,
          });
        }
      };

      const response = await refreshCall();
      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) throw new Error("No token returned");

      localStorage.setItem("bis_access_token", newAccessToken);
      onRefreshed(newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      onRefreshFailed(refreshError);
      localStorage.removeItem("bis_access_token");
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export async function register({ fullName, email, password }) {
  const { data } = await api.post("/auth/register", {
    fullName,
    username: fullName,
    email,
    password,
  });
  if (data?.accessToken) localStorage.setItem("bis_access_token", data.accessToken);
  return data;
}

export async function resendOtp({ fullName, email, password }) {
  const { data } = await api.post("/auth/register", {
    fullName,
    username: fullName,
    email,
    password,
  });
  return data;
}

export async function verifyEmail({ email, otp }) {
  let response;
  try {
    response = await api.post("/auth/verify-email", { email, otp });
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 405) {
      response = await api.get("/auth/verify-email", { params: { email, otp } });
    } else {
      throw err;
    }
  }
  if (response.data?.accessToken) {
    localStorage.setItem("bis_access_token", response.data.accessToken);
  }
  return response.data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.accessToken) localStorage.setItem("bis_access_token", data.accessToken);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/get-me");
  return data;
}

export async function refreshToken() {
  let response;
  try {
    response = await api.post("/auth/refresh-token");
  } catch {
    response = await api.get("/auth/refresh-token");
  }
  if (response.data?.accessToken) {
    localStorage.setItem("bis_access_token", response.data.accessToken);
  }
  return response.data;
}

export async function logout() {
  try {
    await api.post("/auth/logout").catch(() => api.get("/auth/logout"));
  } finally {
    localStorage.removeItem("bis_access_token");
  }
}

export async function logoutAll() {
  try {
    await api.post("/auth/logout-all").catch(() => api.get("/auth/logout-all"));
  } finally {
    localStorage.removeItem("bis_access_token");
  }
}

export default api;