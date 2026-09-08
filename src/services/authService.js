import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-fkpu.onrender.com/api";

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

// Attach access token to every request
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
  refreshSubscribers.forEach(({ resolve }) => {
    resolve(newToken);
  });

  refreshSubscribers = [];
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach(({ reject }) => {
    reject(error);
  });

  refreshSubscribers = [];
}

// Automatically refresh expired access token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-email") ||
      originalRequest.url?.includes("/auth/refresh-token");

    // Only handle expired access-token requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If another request is already refreshing the token,
    // wait for that request to finish.
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
      // Backend currently uses GET /auth/refresh-token
      const response = await axios.get(
        `${API_BASE_URL}/auth/refresh-token`,
        {
          withCredentials: true,
        }
      );

      const newAccessToken = response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("No access token returned");
      }

      localStorage.setItem(
        "bis_access_token",
        newAccessToken
      );

      onRefreshed(newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      onRefreshFailed(refreshError);

      // Refresh token expired/revoked.
      // Only now clear local authentication.
      localStorage.removeItem("bis_access_token");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/";
      }

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

// =========================
// AUTH APIs
// =========================

export async function register({
  fullName,
  email,
  password,
}) {
  const { data } = await api.post("/auth/register", {
    username: fullName,
    email,
    password,
  });

  if (data?.accessToken) {
    localStorage.setItem(
      "bis_access_token",
      data.accessToken
    );
  }

  return data;
}

export async function resendOtp({
  fullName,
  email,
  password,
}) {
  const { data } = await api.post("/auth/register", {
    username: fullName,
    email,
    password,
  });

  return data;
}

export async function verifyEmail({
  email,
  otp,
}) {
  const { data } = await api.post(
    "/auth/verify-email",
    {
      email,
      otp,
    }
  );

  if (data?.accessToken) {
    localStorage.setItem(
      "bis_access_token",
      data.accessToken
    );
  }

  return data;
}

export async function login({
  email,
  password,
}) {
  const { data } = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  if (data?.accessToken) {
    localStorage.setItem(
      "bis_access_token",
      data.accessToken
    );
  }

  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/get-me");

  return data;
}

export async function refreshToken() {
  const { data } = await axios.get(
    `${API_BASE_URL}/auth/refresh-token`,
    {
      withCredentials: true,
    }
  );

  if (data?.accessToken) {
    localStorage.setItem(
      "bis_access_token",
      data.accessToken
    );
  }

  return data;
}

export async function logout() {
  try {
    await axios.get(
      `${API_BASE_URL}/auth/logout`,
      {
        withCredentials: true,
      }
    );
  } finally {
    localStorage.removeItem("bis_access_token");
  }
}

export async function logoutAll() {
  try {
    await axios.get(
      `${API_BASE_URL}/auth/logout-all`,
      {
        withCredentials: true,
      }
    );
  } finally {
    localStorage.removeItem("bis_access_token");
  }
}

export default api;