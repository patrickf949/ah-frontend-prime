import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { REACT_ARTICLE_SUCCESS, REACT_ARTICLE_FAILURE } from "./types";
import { redirectTo } from "../utils/redirect";

const BASE_URL = API_BASE_URL;

export const reactArticle = (slug, reaction) => {
  return async dispatch => {
    const token = sessionStorage.getItem("token");
    if (!token && process.env.NODE_ENV !== "test") {
      redirectTo("/login");
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    };
    return await axios
      .post(
        `${BASE_URL}/articles/${slug}/react/`,
        { reaction },
        { headers: headers }
      )
      .then(data => {
        if (data.data.author) {
          dispatch({
            type: REACT_ARTICLE_SUCCESS,
            payload: data.data
          });
        } else {
          dispatch({
            type: REACT_ARTICLE_FAILURE,
            payload: "Failed to react to article"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: REACT_ARTICLE_FAILURE,
          payload: "Failed to react to article"
        });
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          redirectTo("/login");
        }
      });
  };
};
