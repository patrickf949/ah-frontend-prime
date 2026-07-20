import React, { Component } from "react";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import store from "../store";
import "../styles/app.scss";
import "react-toastify/dist/ReactToastify.css";
import Routes from "../components/routes";
import { ToastContainer } from "react-toastify";
import theme from "../theme";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div>
            <Routes />
            <ToastContainer position="top-right" newestOnTop />
          </div>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
