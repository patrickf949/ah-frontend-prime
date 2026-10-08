import getArticleReducer from "../../reducers/getArticleReducer";
import {
  FETCH_ARTICLE_SUCCESS,
  FETCH_ARTICLE_REQUEST,
  DISLIKE_ARTICLE_SUCCESS,
  LIKE_ARTICLE_SUCCESS,
  REACT_ARTICLE_SUCCESS
} from "../../actions/types";

describe("App", () => {
  const initialState = {
    article: {},
    likes: 0,
    dislikes: 0,
    loading: false
  };
  it("Should handle reducers initial state", () => {
    const newState = getArticleReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it("should handle FETCH_ARTICLE_REQUEST", () => {
    const dispatchedAction = {
      type: FETCH_ARTICLE_REQUEST
    };
    const newState = {
      ...initialState,
      loading: true,
      reactions: null
    };
    expect(getArticleReducer(initialState, dispatchedAction)).toEqual(newState);
  });

  it("should successfully fetch article", () => {
    const dispatchedAction = {
      type: FETCH_ARTICLE_SUCCESS,
      payload: {
        article: {}
      }
    };
    const newState = {
      article: {
        article: {}
      },
      likes: undefined,
      dislikes: undefined,
      loading: false,
      reactions: undefined
    };

    expect(getArticleReducer(initialState, dispatchedAction)).toEqual(newState);
  });

  it("should update counts after an emoji reaction", () => {
    const reactions = {
      total: 3,
      breakdown: [
        { reaction: "like", emoji: "👍", count: 1 },
        { reaction: "fire", emoji: "🔥", count: 2 }
      ]
    };
    const dispatchedAction = {
      type: REACT_ARTICLE_SUCCESS,
      payload: {
        likes: 1,
        dislikes: 0,
        reactions
      }
    };
    const newState = {
      article: {},
      likes: 1,
      dislikes: 0,
      reactions,
      loading: false
    };

    expect(getArticleReducer(initialState, dispatchedAction)).toEqual(newState);
  });

  it("should successfully like a users article", () => {
    const dispatchedAction = {
      type: LIKE_ARTICLE_SUCCESS,
      payload: {
        article: {},
        likes: 1,
        dislikes: 0
      }
    };
    const newState = {
      article: {},
      likes: 1,
      dislikes: 0,
      loading: false
    };

    expect(getArticleReducer(initialState, dispatchedAction)).toEqual(newState);
  });

  it("should successfully dislike a users article", () => {
    const dispatchedAction = {
      type: DISLIKE_ARTICLE_SUCCESS,
      payload: {
        article: {},
        likes: 0,
        dislikes: 1
      }
    };
    const newState = {
      article: {},
      likes: 0,
      dislikes: 1,
      loading: false
    };

    expect(getArticleReducer(initialState, dispatchedAction)).toEqual(newState);
  });
});
