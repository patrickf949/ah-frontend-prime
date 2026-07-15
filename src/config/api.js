// Central API base URL for the whole app.
//
// Set VITE_API_BASE_URL at build/deploy time (e.g. on Vercel) to point the
// frontend at your backend, e.g. https://your-api.onrender.com/api/v1
// The fallback keeps local dev and the legacy staging demo working.
//
// Jest never parses this file: it is mapped to a mock in jest.config.js, so
// the Vite-only `import.meta.env` syntax is not evaluated under the tests.
export const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "https://ah-backend-prime-staging.herokuapp.com/api/v1";

export default API_BASE_URL;
