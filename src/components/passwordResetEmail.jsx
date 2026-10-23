import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import "../styles/passwordreset.scss";
import { ThreeDots } from "react-loader-spinner";

const PasswordResetEmailComponent = props => {
  const { email, handleOnChange, errors, handleOnSubmit, isLoading } = props;
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col col-lg-3 col-sm-auto" />
        <div className="col col-lg-6  col-md-auto col-sm-auto password-reset-container">
          <h2>Password Reset</h2>
          <p>
            Enter your Author's have the email address that you used to
            register. We'll send you an email with a link to reset your
            password.
          </p>
          <form method="POST" onSubmit={handleOnSubmit}>
            <Stack spacing={2.25}>
              <TextField
                type="email"
                name="email"
                id="email"
                required
                label="Email"
                value={email}
                onChange={handleOnChange}
                error={errors.email.length > 0}
                helperText={errors.email.length > 0 ? errors.email : " "}
              />
            <Button type="submit">
              Send link
              <ThreeDots
                height="24"
                width="48"
                color="#003153"
                visible={isLoading}
                ariaLabel="password-reset-email-loading"
              />
            </Button>
            </Stack>
          </form>
        </div>
        <div className="col col-lg-3" />
      </div>
    </div>
  );
};

export default PasswordResetEmailComponent;
