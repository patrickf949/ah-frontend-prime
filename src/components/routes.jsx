import React, { Component } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import LoginContainer from "../containers/Login/LoginContainer";
import SingleArticleComponent from "../components/articles/singleArticle";
import NavBarComponent from "../components/navbar";
import SocialAuthContainer from "../containers/SocialAuthContainer";
import PasswordResetEmailContainer from "../containers/passwordResetEmail";
import PasswordResetContainer from "../containers/passwordReset";
import Home from "./home";
import RegisterContainer from "../containers/registerContainer";
import EditProfileContainer from "../containers/profile/EditProfileContainer";
import UserArticles from "./articles/userArticles";
import CreateArticlePage from "./articles/createArticlePage";
import UsersProfileContainer from "../containers/profile/UsersProfileContainer";
import EditArticlePage from "./articles/editArticlePage";
import { RouteElement } from "../utils/router";

class Routes extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <NavBarComponent />
          <RouterRoutes>
            <Route path="/" element={<RouteElement component={Home} />} />
            <Route
              path="/register"
              element={<RouteElement component={RegisterContainer} />}
            />
            <Route path="/home" element={<RouteElement component={Home} />} />
            <Route
              path="/login"
              element={<RouteElement component={LoginContainer} />}
            />
            <Route
              path="/socialAuth"
              element={<RouteElement component={SocialAuthContainer} />}
            />
            <Route
              path="/editprofile"
              element={<RouteElement component={EditProfileContainer} />}
            />
            <Route
              path="/passwordresetemail"
              element={<RouteElement component={PasswordResetEmailContainer} />}
            />
            <Route
              path="/:token/passwordreset"
              element={<RouteElement component={PasswordResetContainer} />}
            />

            <Route
              path="/create-article"
              element={<RouteElement component={CreateArticlePage} />}
            />
            <Route
              path="/article/:slug"
              element={<RouteElement component={SingleArticleComponent} />}
            />
            <Route
              path="/edit-article/:slug"
              element={<RouteElement component={EditArticlePage} />}
            />
            <Route
              path="/user-articles"
              element={<RouteElement component={UserArticles} />}
            />
            <Route
              path="/profile/:username"
              element={<RouteElement component={UsersProfileContainer} />}
            />
          </RouterRoutes>
        </BrowserRouter>
      </div>
    );
  }
}

export default Routes;
