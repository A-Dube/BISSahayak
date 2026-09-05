import api from "./authService";

export async function createConversation(payload = {}) {
  const { data } = await api.post("/conversations", payload);
  return data;
}

export async function getConversations() {
  const { data } = await api.get("/conversations");
  return data;
}

export async function getMessages(conversationId) {
  const { data } = await api.get(`/conversations/${conversationId}/messages`);
  return data;
}

export async function sendMessagePlaceholder() {
  throw new Error(
    "Chat send endpoint not wired yet — waiting on final ML integration route."
  );
}