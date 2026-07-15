import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import "../styles/passwordreset.scss";
import { ThreeDots } from "react-loader-spinner";

export const PasswordResetComponent = props => {
  const {
    password,
    passwordConfirm,
    handleOnChange,
    errors,
    handleOnSubmit,
    isLoading
  } = props;
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col col-lg-3 col-sm-1" />
          <div className="col col-lg-6  col-md-12 col-sm-12 password-reset-container">
            <div className="">
              <h2>Password Reset</h2>
              <p>
                Please enter and confirm a new password that you will use to
                sign in into Author's haven
              </p>
              <form method="post" onSubmit={handleOnSubmit}>
                <Stack spacing={2.25}>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    required
                    label="Password"
                    value={password}
                    onChange={handleOnChange}
                    error={errors.password.length > 0}
                    helperText={errors.password.length > 0 ? errors.password : " "}
                  />
                  <TextField
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    required
                    label="Confirm password"
                    value={passwordConfirm}
                    onChange={handleOnChange}
                    error={errors.passwordConfirm.length > 0}
                    helperText={
                      errors.passwordConfirm.length > 0
                        ? errors.passwordConfirm
                        : " "
                    }
                  />
                <Button type="submit">
                  Reset
                  <ThreeDots
                    height="24"
                    width="48"
                    color="#003153"
                    visible={isLoading}
                    ariaLabel="password-reset-loading"
                  />
                </Button>
                </Stack>
              </form>
            </div>
          </div>
          <div className="col col-lg-3 col-sm-1 col-sm-auto" />
        </div>
      </div>
    </div>
  );
};
export default PasswordResetComponent;
