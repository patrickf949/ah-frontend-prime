// Jest stand-in for src/config/api.js (which uses Vite's import.meta.env).
// Matches the URL the action tests stub against.
const API_BASE_URL = "https://ah-backend-prime-staging.herokuapp.com/api/v1";
module.exports = { API_BASE_URL, default: API_BASE_URL, __esModule: true };
