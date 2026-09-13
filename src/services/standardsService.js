import api from "./authService";

export async function searchStandards({ query }) {
  const response = await api.post("/standards/search", {
    query,
  });

  return response.data;
}