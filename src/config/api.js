// Central API base URL for the whole app.
//
// Set VITE_API_BASE_URL at build/deploy time (e.g. on Vercel) to point the
// frontend at your backend, e.g. https://ah-backend-prime.onrender.com/api/v1
//
// Jest never parses this file: it is mapped to a mock in jest.config.js, so
// the Vite-only `import.meta.env` syntax is not evaluated under the tests.
const getApiBaseUrl = () => {
  const envUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL;

  let url = (envUrl || "https://ah-backend-prime.onrender.com/api/v1").trim();

  // Strip trailing slashes to prevent double slashes when endpoints are concatenated
  url = url.replace(/\/+$/, "");

  // Ensure /api/v1 prefix exists if only the root hostname was supplied
  if (!url.endsWith("/api/v1")) {
    url = `${url}/api/v1`;
  }

  return url;
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
