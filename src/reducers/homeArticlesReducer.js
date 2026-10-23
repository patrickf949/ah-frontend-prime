import { FETCH_HOME_ARTICLES_SUCCESS } from "../actions/types";

const initialState = {
  latest: [],
  trending: [],
  popular: []
};

const homeArticlesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_ARTICLES_SUCCESS:
      return {
        ...state,
        latest: action.payload.latest,
        trending: action.payload.trending,
        popular: action.payload.popular
      };
    default:
      return state;
  }
};

export default homeArticlesReducer;
