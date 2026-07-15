import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./containers/app";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("App")).render(<App />);
