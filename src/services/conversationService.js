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

// TODO: replace this once the chat endpoint is shared. Per the confirmed
// flow (Frontend -> Backend -> ML -> Backend -> Frontend), this should
// become something like:
//   const { data } = await api.post(`/conversations/${conversationId}/messages`, { text })
//   return data
// Do NOT call any ML API directly from the frontend — always go through
// this backend endpoint once it exists.
export async function sendMessagePlaceholder() {
  throw new Error(
    "Chat send endpoint not wired yet — waiting on final ML integration route."
  );
}