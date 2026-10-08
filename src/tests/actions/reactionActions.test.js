import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import { reactArticle } from "../../actions/reactionActions";
import {
  REACT_ARTICLE_SUCCESS,
  REACT_ARTICLE_FAILURE
} from "../../actions/types";
import { redirectTo } from "../../utils/redirect";

jest.mock("../../utils/redirect", () => ({
  redirectTo: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const articleResponse = {
  id: 64,
  author: { username: "patritsfitz" },
  title: "kuhcf",
  slug: "kuhcf-0x3f",
  likes: 1,
  dislikes: 0,
  reactions: {
    total: 2,
    breakdown: [
      { reaction: "like", emoji: "👍", count: 1 },
      { reaction: "fire", emoji: "🔥", count: 1 }
    ]
  }
};

describe("Reaction action", () => {
  beforeEach(function() {
    moxios.install();
  });
  afterEach(function() {
    moxios.uninstall();
  });

  it("should dispatch success with the updated article", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({
        status: 201,
        response: articleResponse
      });
    });
    const expectedActions = [
      {
        type: REACT_ARTICLE_SUCCESS,
        payload: articleResponse
      }
    ];
    return store.dispatch(reactArticle("kuhcf-0x3f", "fire")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should dispatch failure when the response has no article", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({
        status: 201,
        response: { error: "nope" }
      });
    });
    const expectedActions = [
      {
        type: REACT_ARTICLE_FAILURE,
        payload: "Failed to react to article"
      }
    ];
    return store.dispatch(reactArticle("kuhcf-0x3f", "fire")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should dispatch failure on a request error", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({
        status: 400,
        response: { errors: { reaction: ["Invalid reaction."] } }
      });
    });
    const expectedActions = [
      {
        type: REACT_ARTICLE_FAILURE,
        payload: "Failed to react to article"
      }
    ];
    return store.dispatch(reactArticle("kuhcf-0x3f", "banana")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should redirect to login when token is absent for reactArticle", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    sessionStorage.removeItem("token");
    const store = mockStore({});
    
    store.dispatch(reactArticle("kuhcf-0x3f", "fire"));
    expect(redirectTo).toHaveBeenCalledWith("/login");
    process.env.NODE_ENV = originalEnv;
  });

  it("should redirect to login on 401 error in reactArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 401,
        response: { error: "Unauthorized" }
      });
    });

    return store.dispatch(reactArticle("kuhcf-0x3f", "fire")).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should redirect to login on 403 error in reactArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 403,
        response: { error: "Forbidden" }
      });
    });

    return store.dispatch(reactArticle("kuhcf-0x3f", "fire")).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });
});
