

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function register({ email, password, name }) {
  const { data } = await api.post("/auth/register", { email, password, name });
  if (data.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/get-me");
  return data;
}

export async function refreshToken() {
  const { data } = await api.get("/auth/refresh-token");
  if (data.accessToken) {
    localStorage.setItem("bis_access_token", data.accessToken);
  }
  return data;
}

export async function logout() {
  await api.get("/auth/logout");
  localStorage.removeItem("bis_access_token");
}

export async function logoutAll() {
  await api.get("/auth/logout-all");
  localStorage.removeItem("bis_access_token");
}

export async function verifyEmail() {
  const { data } = await api.get("/auth/verify-email");
  return data;
}

export function getToken() {
  return localStorage.getItem("bis_access_token");
}

export function isAuthenticated() {
  return !!getToken();
}