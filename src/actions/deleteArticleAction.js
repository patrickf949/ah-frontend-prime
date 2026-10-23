import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { DELETE_ARTICLE_SUCCESS } from "./types";
import { toast } from "react-toastify";

export const deleteArticleAction = (slug, props) => dispatch => {
  return axios({
    url:
      API_BASE_URL + "/articles/" + slug,
    method: "delete",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(response => {
    toast.success(response.data.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      onClose: () => props.history.go(0)
    });
    dispatch(deleteArticleSuccess(response.data));

    // setTimeout(props.history.go(0), 5000);
  });
};

const deleteArticleSuccess = payload => {
  return {
    type: DELETE_ARTICLE_SUCCESS,
    payload: payload
  };
};
