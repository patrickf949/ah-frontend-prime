import { API_BASE_URL } from "../config/api";
import {
  REGISTRATION_ERROR_MESSAGE,
  RIGISTRATION_SUCCESS_MESSAGE,
  IS_LOADING
} from "../actions/types";
import axios from "axios";
import { toast } from "react-toastify";

export const registerUser = userData => async dispatch => {
  toast.dismiss();
  dispatch({
    type: IS_LOADING
  });
  await axios
    .post(
      API_BASE_URL + "/users/register/",
      { user: userData }
    )
    .then(res => {
      dispatch({
        type: RIGISTRATION_SUCCESS_MESSAGE,
        payload: res.data
      });
      toast.success(
        `your have Successfully registered, an email with activation link has been sent to your account!`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false
        }
      );
    })
    .catch(error => {
      dispatch({
        type: REGISTRATION_ERROR_MESSAGE,
        payload: error.response.data
      });
      const errorMessage = error.response.data.errors;
      Object.keys(errorMessage).forEach(key => {
        toast.error(`sorry ${errorMessage[key]}`, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false
        });
      });
    });
};
