import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { FETCH_HOME_ARTICLES_SUCCESS } from "./types";

const BASE_URL = API_BASE_URL;

export const getHomeArticlesAction = (
  baseUrl = BASE_URL
) => async dispatch => {
  const endpoints = {
    latest: `${baseUrl}/articles/latest/?limit=5`,
    trending: `${baseUrl}/articles/trending/?limit=4`,
    popular: `${baseUrl}/articles/popular/?limit=4`
  };
  const [latest, trending, popular] = await Promise.all(
    Object.values(endpoints).map(url =>
      axios
        .get(url)
        .then(response => response.data.articles)
        .catch(() => [])
    )
  );
  dispatch(fetchHomeArticlesSuccess({ latest, trending, popular }));
};

const fetchHomeArticlesSuccess = payload => {
  return {
    type: FETCH_HOME_ARTICLES_SUCCESS,
    payload: payload
  };
};
