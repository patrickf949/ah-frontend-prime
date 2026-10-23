import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./containers/app";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("App")).render(<App />);
