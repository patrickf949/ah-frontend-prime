import { API_BASE_URL } from "../config/api";
import axios from "axios";
import {
  LIKE_ARTICLE_FAILURE,
  LIKE_ARTICLE_SUCCESS,
  DISLIKE_ARTICLE_FAILURE,
  DISLIKE_ARTICLE_SUCCESS
} from "./types";
import { redirectTo } from "../utils/redirect";

export const likeArticle = slug => {
  return async dispatch => {
    const token = sessionStorage.getItem("token");
    if (!token && process.env.NODE_ENV !== "test") {
      redirectTo("/login");
      return;
    }
    const body = {};
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    };
    return await axios
      .post(
        `${API_BASE_URL}/articles/${slug}/like/`,
        body,
        { headers: headers }
      )
      .then(data => {
        if (data.data.author) {
          dispatch({
            type: LIKE_ARTICLE_SUCCESS,
            payload: data.data
          });
        } else {
          dispatch({
            type: LIKE_ARTICLE_FAILURE,
            payload: "Failed to like article"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: LIKE_ARTICLE_FAILURE,
          payload: "Failed to like article"
        });
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          redirectTo("/login");
        }
      });
  };
};

export const dislikeArticle = slug => {
  return async dispatch => {
    const token = sessionStorage.getItem("token");
    if (!token && process.env.NODE_ENV !== "test") {
      redirectTo("/login");
      return;
    }
    const body = {};
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    };
    return await axios
      .post(
        `${API_BASE_URL}/articles/${slug}/dislike/`,
        body,
        { headers: headers }
      )
      .then(data => {
        if (data.data.author) {
          dispatch({
            type: DISLIKE_ARTICLE_SUCCESS,
            payload: data.data
          });
        } else {
          dispatch({
            type: DISLIKE_ARTICLE_FAILURE,
            payload: "Failed to dislike article"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: DISLIKE_ARTICLE_FAILURE,
          payload: "Failed to dislike article"
        });
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          redirectTo("/login");
        }
      });
  };
};
