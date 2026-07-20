import { FETCH_COMMENTS, FETCH_COMMENTS_REQUEST, FETCH_COMMENTS_ERRORS } from "../actions/types";

const initialState = {
  comments: [],
  loading: false
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMMENTS_REQUEST:
      return {
        ...state,
        comments: [],
        loading: true
      };
    case FETCH_COMMENTS:
      return {
        ...state,
        comments: action.payload,
        loading: false
      };
    case FETCH_COMMENTS_ERRORS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

