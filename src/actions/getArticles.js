import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { FETCH_ARTICLES_SUCCESS } from "./types";

export const getArticlesAction = (
  url = API_BASE_URL + "/articles/"
) => async dispatch => {
  return axios.get(url).then(response => {
    dispatch(fetchArticlesSuccess(response.data));
  });
};

const fetchArticlesSuccess = payload => {
  return {
    type: FETCH_ARTICLES_SUCCESS,
    payload: payload
  };
};
