import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { FETCH_ARTICLE_SUCCESS, FETCH_ARTICLE_REQUEST } from "./types";
import { getUsersProfileAction } from "./profileActions";

export const getArticleAction = slug => dispatch => {
  dispatch({ type: FETCH_ARTICLE_REQUEST });
  return axios
    .get(
      API_BASE_URL + "/articles/" + slug
    )

    .then(response => {
      dispatch(fetchArticlesSuccess(response.data));
      const username = response.data.article.author.username;
      sessionStorage.setItem("userview_name", username);
      dispatch(getUsersProfileAction(username));
    });
};

const fetchArticlesSuccess = payload => {
  return {
    type: FETCH_ARTICLE_SUCCESS,
    payload: payload
  };
};
