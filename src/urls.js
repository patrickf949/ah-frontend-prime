import { API_BASE_URL } from "./config/api";

const endpoints = {
  googleLogin: `${API_BASE_URL}/social/auth/google/`,
  facebookLogin: `${API_BASE_URL}/social/auth/facebook/`
};

export default endpoints;
