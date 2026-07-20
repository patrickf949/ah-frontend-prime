import { API_BASE_URL } from "../config/api";
import {
  CREATE_COMMENTS,
  CREATE_COMMENTS_ERRORS,
  FETCH_COMMENTS,
  FETCH_COMMENTS_REQUEST,
  FETCH_COMMENTS_ERRORS
} from "./types";
import axios from "axios";
import { toast } from "react-toastify";

export const articleComments = (data, slug) => async dispatch => {
  const token = sessionStorage.getItem("token");
  if (!token && process.env.NODE_ENV !== "test") {
    window.location.href = "/login";
    return;
  }
  return await axios
    .post(
      `${API_BASE_URL}/articles/${slug}/comments/0/`,
      data,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then(res => {
      dispatch({
        type: CREATE_COMMENTS,
        payload: res.data
      });
      toast.dismiss();
      toast.success("thanks for your view", {
        hideProgressBar: false,
        autoClose: 3000
      });
    })
    .catch(errors => {
      dispatch({
        type: CREATE_COMMENTS_ERRORS,
        payload: errors.response ? errors.response.data : "Failed to post comment"
      });
      if (errors.response && (errors.response.status === 403 || errors.response.status === 401)) {
        window.location.href = "/login";
      }
    });
};
export const fetchComments = (slug, showLoader = true) => async dispatch => {
  if (showLoader) {
    dispatch({ type: FETCH_COMMENTS_REQUEST });
  }
  const token = sessionStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  return await axios
    .get(
      `${API_BASE_URL}/articles/${slug}/comments/0/`,
      { headers }
    )
    .then(res => {
      dispatch({
        type: FETCH_COMMENTS,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_COMMENTS_ERRORS,
        payload: { errors: "error fetching your comments" }
      });
    });
};

