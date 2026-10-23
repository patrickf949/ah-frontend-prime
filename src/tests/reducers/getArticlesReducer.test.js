import getArticlesReducer from "../../reducers/getArticlesReducer";
import { FETCH_ARTICLES_SUCCESS, FETCH_ARTICLES_REQUEST } from "../../actions/types";
import data from "../mock_data/moxios_mock";

describe("App", () => {
  const initialState = {
    articles: [],
    loading: false
  };
  it("Should handle reducers initial state", () => {
    const newState = getArticlesReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it("Should handle FETCH_ARTICLES_REQUEST", () => {
    const newState = getArticlesReducer(initialState, {
      type: FETCH_ARTICLES_REQUEST
    });
    expect(newState).toEqual({
      ...initialState,
      loading: true
    });
  });

  it("Should handle reducers after getting articles", () => {
    const newState = getArticlesReducer(initialState, {
      type: FETCH_ARTICLES_SUCCESS,
      payload: {
        results: data.articles
      }
    });
    expect(newState).toEqual({
      ...initialState,
      articles: data.articles,
      loading: false
    });
  });
});
