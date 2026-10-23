import { FETCH_ARTICLES_SUCCESS, FETCH_ARTICLES_REQUEST } from "../actions/types";

const initialState = {
  articles: [],
  loading: false
};

const getArticlesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ARTICLES_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_ARTICLES_SUCCESS:
      return {
        ...state,
        articles: action.payload.results,
        next: action.payload.next,
        previous: action.payload["previous"],
        loading: false
      };
    default:
      return state;
  }
};

export default getArticlesReducer;
