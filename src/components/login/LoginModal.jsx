import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack, TextField } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/register.scss";
import SocialAuthContainer from "../../containers/SocialAuthContainer";

const LoginComponent = props => {
  const { password, email, handleChange, handleSubmit, isProcessing } = props;

  return (
    <div className="auth-page container-fluid px-3">
      <div className="row">
        <div className="col-lg-2 col-md-2" />
        <div className="col-lg-8 col-md-8">
          <section className="Paper">
            <h3>Welcome back!</h3>
            <p>
              SignIn to like, dislike, favorite and unfavorite various articles,
              <br />
              follow authors and comment on articles.
            </p>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="button-collective">
                  <SocialAuthContainer />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 grid-register" id="login-form">
                <form method="post" onSubmit={handleSubmit}>
                  <Stack spacing={2.25}>
                  <TextField
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleChange}
                  />
                  <TextField
                    id="password"
                    label="Password"
                    name="password"
                    required
                    minLength={6}
                    maxLength={16}
                    type="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <ThreeDots
                    height="24"
                    width="48"
                    color="#003153"
                    visible={isProcessing}
                    ariaLabel="login-loading"
                  />
                  <Button type="submit" className="button-success">
                    Login
                  </Button>
                  </Stack>
                </form>
              </div>
            </div>
            <p>
              Don't have an account yet?{" "}
              <Link to="/register" id="link">
                create one now
              </Link>
            </p>
            <p>
              Forgot your password?{" "}
              <Link to="/passwordresetemail" id="link">
                reset now
              </Link>
            </p>
          </section>
        </div>
        <div className="col-lg-2 col-md-2" />
      </div>
    </div>
  );
};
export default LoginComponent;
