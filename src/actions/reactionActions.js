import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { REACT_ARTICLE_SUCCESS, REACT_ARTICLE_FAILURE } from "./types";

const BASE_URL = API_BASE_URL;

export const reactArticle = (slug, reaction) => {
  return async dispatch => {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
      .catch(() => {
        dispatch({
          type: REACT_ARTICLE_FAILURE,
          payload: "Failed to react to article"
        });
      });
  };
};
