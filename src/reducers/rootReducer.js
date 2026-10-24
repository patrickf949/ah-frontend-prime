import { combineReducers } from "redux";
import authReducer from "./authReducer";
import loginReducer from "./loginReducer";
import getArticlesReducer from "./getArticlesReducer";
import homeArticlesReducer from "./homeArticlesReducer";
import { socialAuthReducer } from "./socialAuthReducer";
import passwordResetReducer from "./passwordResetReducer";
import passwordChangeReducer from "./passwordChangeReducer";
import profileReducer from "./profileReducer";
import getArticleReducer from "./getArticleReducer";
import createArticleReducer from "./createArticleReducer";
import followsUnfollowsReducer from "./followsUnfollowsReducer";
import commentsReducer from "./commentsReducer";
import getCommentsReducer from "./getCommentsReducer";

const rootReducer = combineReducers({
  auth_login: loginReducer,
  getArticlesReducer,
  homeArticlesReducer,
  getArticleReducer,
  createArticleReducer,
  auth: authReducer,
  socialAuthReducer: socialAuthReducer,
  passReset: passwordResetReducer,
  passChange: passwordChangeReducer,
  profileReducer: profileReducer,
  followsUnfollowsReducer: followsUnfollowsReducer,
  comments: commentsReducer,
  getComments: getCommentsReducer
});

export default rootReducer;
