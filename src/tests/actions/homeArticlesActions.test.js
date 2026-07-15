import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import { getHomeArticlesAction } from "../../actions/homeArticlesActions";
import { FETCH_HOME_ARTICLES_SUCCESS } from "../../actions/types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const BASE_URL = "https://ah-backend-prime-staging.herokuapp.com/api/v1";

const latestArticles = [{ slug: "newest-article", title: "Newest" }];
const trendingArticles = [{ slug: "trending-article", title: "Trending" }];
const popularArticles = [{ slug: "popular-article", title: "Popular" }];

describe("Home articles action", () => {
  beforeEach(function() {
    moxios.install();
  });
  afterEach(function() {
    moxios.uninstall();
  });

  it("should fetch latest, trending and popular articles", () => {
    moxios.stubRequest(`${BASE_URL}/articles/latest/?limit=5`, {
      status: 200,
      response: { articles: latestArticles }
    });
    moxios.stubRequest(`${BASE_URL}/articles/trending/?limit=4`, {
      status: 200,
      response: { articles: trendingArticles }
    });
    moxios.stubRequest(`${BASE_URL}/articles/popular/?limit=4`, {
      status: 200,
      response: { articles: popularArticles }
    });

    const store = mockStore({});
    const expectedActions = [
      {
        type: FETCH_HOME_ARTICLES_SUCCESS,
        payload: {
          latest: latestArticles,
          trending: trendingArticles,
          popular: popularArticles
        }
      }
    ];
    return store.dispatch(getHomeArticlesAction()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should fall back to empty lists when a request fails", () => {
    moxios.stubRequest(`${BASE_URL}/articles/latest/?limit=5`, {
      status: 200,
      response: { articles: latestArticles }
    });
    moxios.stubRequest(`${BASE_URL}/articles/trending/?limit=4`, {
      status: 500,
      response: {}
    });
    moxios.stubRequest(`${BASE_URL}/articles/popular/?limit=4`, {
      status: 500,
      response: {}
    });

    const store = mockStore({});
    const expectedActions = [
      {
        type: FETCH_HOME_ARTICLES_SUCCESS,
        payload: {
          latest: latestArticles,
          trending: [],
          popular: []
        }
      }
    ];
    return store.dispatch(getHomeArticlesAction()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
