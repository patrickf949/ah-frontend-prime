import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import moxios from "moxios";
import { articleComments, fetchComments } from "../../actions/commentsActions";
import { commentData, fetchAllComments } from "../mock_data/moxios_mock";
import {
  CREATE_COMMENTS,
  CREATE_COMMENTS_ERRORS,
  FETCH_COMMENTS,
  FETCH_COMMENTS_ERRORS,
  FETCH_COMMENTS_REQUEST
} from "../../actions/types";
import { redirectTo } from "../../utils/redirect";

jest.mock("../../utils/redirect", () => ({
  redirectTo: jest.fn()
}));

const middleware = [thunk];
const mockStore = configureStore(middleware);
describe("testing create comments action", function() {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it("should test create comments actions", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: commentData
      });
    });
    const expectedActions = [
      {
        type: CREATE_COMMENTS,
        payload: commentData
      }
    ];

    return store
      .dispatch(
        articleComments(
          {
            body: "prime@gmail.com"
          },
          "the02f"
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
  it("should test create comments error", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const mockData = {
        errors: {
          body: ["This field may not be blank."]
        }
      };
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: mockData
      });
    });
    const expectedActions = [
      {
        type: CREATE_COMMENTS_ERRORS,
        payload: {
          errors: {
            body: ["This field may not be blank."]
          }
        }
      }
    ];

    return store
      .dispatch(
        articleComments(
          {
            body: ""
          },
          "the02f"
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
  it("should test fetch comments actions", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: fetchAllComments
      });
    });
    const expectedActions = [
      {
        type: FETCH_COMMENTS_REQUEST
      },
      {
        type: FETCH_COMMENTS,
        payload: fetchAllComments.message
      }
    ];

    return store.dispatch(fetchComments("the02f")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should test fetch comments with showLoader=false and token", () => {
    sessionStorage.setItem("token", "dummy-token");
    const store = mockStore({});
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: fetchAllComments
      });
    });
    const expectedActions = [
      {
        type: FETCH_COMMENTS,
        payload: fetchAllComments.message
      }
    ];

    return store.dispatch(fetchComments("the02f", false)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      sessionStorage.removeItem("token");
    });
  });

  it("should test fetch comments errors actions", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: { errors: "error fetching your comments" }
      });
    });
    const expectedActions = [
      {
        type: FETCH_COMMENTS_REQUEST
      },
      {
        type: FETCH_COMMENTS_ERRORS,
        payload: { errors: "error fetching your comments" }
      }
    ];

    return store.dispatch(fetchComments("the02f")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should redirect to login when token is absent for articleComments", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    sessionStorage.removeItem("token");
    const store = mockStore({});
    
    store.dispatch(articleComments({ body: "test" }, "test-slug"));
    expect(redirectTo).toHaveBeenCalledWith("/login");
    process.env.NODE_ENV = originalEnv;
  });

  it("should redirect to login on 401 error in articleComments", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 401,
        response: { error: "Unauthorized" }
      });
    });

    return store.dispatch(articleComments({ body: "test" }, "test-slug")).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should redirect to login on 403 error in articleComments", () => {
    sessionStorage.setItem("token", "dummy");
    const store = mockStore({});

    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 403,
        response: { error: "Forbidden" }
      });
    });

    return store.dispatch(articleComments({ body: "test" }, "test-slug")).then(() => {
      expect(redirectTo).toHaveBeenCalledWith("/login");
    });
  });

  it("should handle network error without response in articleComments", () => {
    const store = mockStore({});
    moxios.wait(() => {
      moxios.requests.mostRecent().reject(new Error("Network Error"));
    });
    
    return store.dispatch(articleComments({ body: "test" }, "test-slug")).then(() => {
      expect(store.getActions()).toEqual([{ type: CREATE_COMMENTS_ERRORS, payload: "Failed to post comment" }]);
    });
  });
});
