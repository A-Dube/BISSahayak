import api from "./authService";

// NOT LIVE YET — there is no standards-search endpoint on the backend
// as of the confirmed API list (only auth + conversations exist so far).
// Swap the body of this function for a real api.get(...) call once
// that endpoint is built and shared, matching the pattern used
// elsewhere (see conversationService.js's sendMessagePlaceholder).
export async function searchStandards({ query, filters }) {
  throw new Error(
    "Standards search endpoint not available yet — backend hasn't shared it."
  );
}