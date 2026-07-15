import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack, TextField } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import "../styles/register.scss";
import SocialAuthContainer from "../containers/SocialAuthContainer";

export const RegisterComponent = props => {
  const {
    password,
    username,
    email,
    handleOnChange,
    errors,
    handleOnSubmit,
    isRegistering
  } = props;
  return (
    <div className="auth-page container-fluid px-3">
      <div className="row">
        <div className="col-lg-2 col-md-2" />
        <div className="col-lg-8 col-md-8">
          <section className="Paper">
            <h3>Join Authors Haven Today</h3>
            <p>
              A social that Creates a community of like minded authors to foster
              inspiration and
              <br />
              innovation by leveraging the modern web.
            </p>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="button-collective">
                  <SocialAuthContainer />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 grid-register">
                <form method="post" onSubmit={handleOnSubmit} id="registerForm">
                  <Stack spacing={2.25}>
                  <TextField
                    id="username"
                    label="Username"
                    name="username"
                    required
                    type="text"
                    value={username}
                    onChange={handleOnChange}
                    error={errors.username.length > 0}
                    helperText={errors.username.length > 0 ? errors.username : " "}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    name="email"
                    required
                    type="email"
                    value={email}
                    onChange={handleOnChange}
                    error={errors.email.length > 0}
                    helperText={errors.email.length > 0 ? errors.email : " "}
                  />
                  <TextField
                    id="password"
                    label="Password"
                    name="password"
                    required
                    type="password"
                    value={password}
                    onChange={handleOnChange}
                    error={errors.password.length > 0}
                    helperText={errors.password.length > 0 ? errors.password : " "}
                  />
                  <Button type="submit" className="button-success">
                    Register
                    <ThreeDots
                      height="20"
                      width="42"
                      color="#ffffff"
                      visible={isRegistering}
                      ariaLabel="register-loading"
                    />
                  </Button>
                  </Stack>
                </form>
              </div>
            </div>
            <p>
              Already have an Account? <Link to="/login"> login</Link>
            </p>
          </section>
        </div>
        <div className="col-lg-2 col-md-2" />
      </div>
    </div>
  );
};
export default RegisterComponent;
