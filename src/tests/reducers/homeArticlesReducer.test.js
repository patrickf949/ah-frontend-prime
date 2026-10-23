import homeArticlesReducer from "../../reducers/homeArticlesReducer";
import { FETCH_HOME_ARTICLES_SUCCESS } from "../../actions/types";

describe("Home articles reducer", () => {
  const initialState = {
    latest: [],
    trending: [],
    popular: []
  };

  it("should return the initial state", () => {
    expect(homeArticlesReducer(undefined, {})).toEqual(initialState);
  });

  it("should store latest, trending and popular articles", () => {
    const payload = {
      latest: [{ slug: "a" }],
      trending: [{ slug: "b" }],
      popular: [{ slug: "c" }]
    };
    const newState = homeArticlesReducer(initialState, {
      type: FETCH_HOME_ARTICLES_SUCCESS,
      payload
    });
    expect(newState).toEqual(payload);
  });
});
