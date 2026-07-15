import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import config from "../../src/config.json";

export const SocialAuth = props => (
  <div>
    <div className="face-book">
      <FacebookLogin
        appId={config.appId}
        fields="name,email,picture"
        onSuccess={props.facebooksuccess}
        onFail={props.facebookfailure}
        render={({ onClick }) => (
          <button type="button" onClick={onClick}>
            <img
              src="https://img.icons8.com/color/96/000000/facebook.png"
              width="40"
              height="40"
              alt="facebook"
            />
            SIGN IN WITH FACEBOOK
          </button>
        )}
      />
    </div>
    <br />
    <div className="google">
      <GoogleOAuthProvider clientId={config.clientId}>
        <GoogleLogin
          text="signin_with"
          onSuccess={props.googlesuccess}
          onError={props.googlefailure}
        />
      </GoogleOAuthProvider>
    </div>
  </div>
);

export default SocialAuth;
