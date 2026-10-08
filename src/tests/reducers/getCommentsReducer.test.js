import getCommentsReducer from "../../reducers/getCommentsReducer";
import { FETCH_COMMENTS } from "../../actions/types";
import { fetchAllComments } from "../mock_data/moxios_mock";

describe("get comments reducer", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      comments: [],
      loading: false
    };
  });
  it("should initial state of the reducer", () => {
    const expectedState = getCommentsReducer(undefined, {});
    expect(expectedState).toEqual(initialState);
  });
  it("should test fetch comment state of the reducer", () => {
    const expectedState = getCommentsReducer(initialState, {
      type: FETCH_COMMENTS,
      payload: fetchAllComments
    });
    expect(expectedState).toEqual({
      ...initialState,
      comments: fetchAllComments
    });
  });

  it("should handle FETCH_COMMENTS_REQUEST", () => {
    const expectedState = getCommentsReducer(initialState, {
      type: "FETCH_COMMENTS_REQUEST"
    });
    expect(expectedState).toEqual({
      ...initialState,
      comments: [],
      loading: true
    });
  });

  it("should handle FETCH_COMMENTS_ERRORS", () => {
    const expectedState = getCommentsReducer(initialState, {
      type: "FETCH_COMMENTS_ERRORS"
    });
    expect(expectedState).toEqual({
      ...initialState,
      loading: false
    });
  });
});
