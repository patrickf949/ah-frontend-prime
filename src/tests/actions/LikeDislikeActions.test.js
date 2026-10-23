import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import { likeArticle, dislikeArticle } from "../../actions/LikeDislikeActions";

import {
  LIKE_ARTICLE_SUCCESS,
  DISLIKE_ARTICLE_SUCCESS,
  LIKE_ARTICLE_FAILURE,
  DISLIKE_ARTICLE_FAILURE
} from "../../actions/types";
import { redirectTo } from "../../utils/redirect";

jest.mock("../../utils/redirect", () => ({
  redirectTo: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("LikeDislike action", () => {
  beforeEach(function() {
    moxios.install();
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("should call the like action", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 200,
        response: {
          id: 64,
          author: {
            username: "patritsfitz",
            bio:
              "This is my favorite song, I just dunno the words, but I still mess with you, you just ain't never heard. It goes like drop that thing. The day you don't drop that thing"
          },
          title: "kuhcf",
          average_rating: 0,
          slug: "kuhcf-0x3f",
          likes: 1,
          dislikes: 0
        }
      });
    });
    const expectedActions = [
      {
        type: LIKE_ARTICLE_SUCCESS,
        payload: {
          id: 64,
          author: {
            username: "patritsfitz",
            bio:
              "This is my favorite song, I just dunno the words, but I still mess with you, you just ain't never heard. It goes like drop that thing. The day you don't drop that thing"
          },
          title: "kuhcf",
          average_rating: 0,
          slug: "kuhcf-0x3f",
          likes: 1,
          dislikes: 0
        }
      }
    ];
    const slug = "kuhcf-0x3f";
    return store.dispatch(likeArticle(slug)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should call the dislike action", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 200,
        response: {
          id: 64,
          author: {
            username: "patritsfitz",
            bio:
              "This is my favorite song, I just dunno the words, but I still mess with you, you just ain't never heard. It goes like drop that thing. The day you don't drop that thing"
          },
          title: "kuhcf",
          average_rating: 0,
          slug: "kuhcf-0x3f",
          likes: 1,
          dislikes: 0
        }
      });
    });
    const expectedActions = [
      {
        type: DISLIKE_ARTICLE_SUCCESS,
        payload: {
          id: 64,
          author: {
            username: "patritsfitz",
            bio:
              "This is my favorite song, I just dunno the words, but I still mess with you, you just ain't never heard. It goes like drop that thing. The day you don't drop that thing"
          },
          title: "kuhcf",
          average_rating: 0,
          slug: "kuhcf-0x3f",
          likes: 1,
          dislikes: 0
        }
      }
    ];
    const slug = "kuhcf-0x3f";
    return store.dispatch(dislikeArticle(slug)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should fail to call the dislike action", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        response: {
          error: "Failed to dislike article"
        }
      });
    });
    const expectedActions = [
      {
        type: DISLIKE_ARTICLE_FAILURE,
        payload: "Failed to dislike article"
      }
    ];
    const slug = "kuhcf-0x3f";
    return store.dispatch(dislikeArticle(slug)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should fail to call the like action", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        response: {
          error: "Failed to like article"
        }
      });
    });
    const expectedActions = [
      {
        type: LIKE_ARTICLE_FAILURE,
        payload: "Failed to like article"
      }
    ];
    const slug = "kuhcf-0x3f";
    return store.dispatch(likeArticle(slug)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should redirect to login when token is absent for likeArticle", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    sessionStorage.removeItem("token");
    const store = mockStore({});
    
    store.dispatch(likeArticle("test-slug"));
    expect(redirectTo).toHaveBeenCalledWith("/login");
    process.env.NODE_ENV = originalEnv;
  });

  it("should redirect to login when token is absent for dislikeArticle", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    sessionStorage.removeItem("token");
    const store = mockStore({});
    
    store.dispatch(dislikeArticle("test-slug"));
    expect(redirectTo).toHaveBeenCalledWith("/login");
    process.env.NODE_ENV = originalEnv;
  });

  it("should redirect to login on 401 error in likeArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 401,
        response: { error: "Unauthorized" }
      });
    });

    const slug = "test-slug";
    return store.dispatch(likeArticle(slug)).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should redirect to login on 403 error in dislikeArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 403,
        response: { error: "Forbidden" }
      });
    });

    const slug = "test-slug";
    return store.dispatch(dislikeArticle(slug)).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should redirect to login on 401 error in dislikeArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 401,
        response: { error: "Unauthorized" }
      });
    });

    const slug = "test-slug";
    return store.dispatch(dislikeArticle(slug)).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should redirect to login on 403 error in likeArticle", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 403,
        response: { error: "Forbidden" }
      });
    });

    const slug = "test-slug";
    return store.dispatch(likeArticle(slug)).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });


  it("should handle network error without response in likeArticle", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().reject(new Error("Network Error"));
    });
    return store.dispatch(likeArticle("test-slug")).then(() => {
      expect(store.getActions()).toEqual([{ type: LIKE_ARTICLE_FAILURE, payload: "Failed to like article" }]);
    });
  });

  it("should handle network error without response in dislikeArticle", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().reject(new Error("Network Error"));
    });
    return store.dispatch(dislikeArticle("test-slug")).then(() => {
      expect(store.getActions()).toEqual([{ type: DISLIKE_ARTICLE_FAILURE, payload: "Failed to dislike article" }]);
    });
  });
});
