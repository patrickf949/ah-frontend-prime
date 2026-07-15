import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PROFILE_FETCH_FAILED,
  PROFILE_FETCHED,
  PROFILE_EDIT_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  FOLLOWERS_LIST,
  FOLLOWING_LIST,
  FOLLOWERS_LIST_FAILED,
  FOLLOWING_LIST_FAILED
} from "./types";

export const getUsersFollowing = username => {
  return async dispatch => {
    return await axios
      .get(
        `${API_BASE_URL}/profiles/following/${username}`,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.token
          }
        }
      )
      .then(data => {
        dispatch({
          type: FOLLOWING_LIST,
          payload: data.data.profiles
        });
      })

      .catch(function(error) {
        dispatch({
          type: FOLLOWING_LIST_FAILED,
          payload: error
        });
      });
  };
};

export const getUsersFollowers = username => {
  return async dispatch => {
    return await axios
      .get(
        `${API_BASE_URL}/profiles/followers/${username}`,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.token
          }
        }
      )
      .then(function(response) {
        const data = response.data.profiles;
        dispatch({
          type: FOLLOWERS_LIST,
          payload: data
        });
      })
      .catch(function(error) {
        dispatch({
          type: FOLLOWERS_LIST_FAILED,
          payload: error
        });
      });
  };
};

export const getUsersProfileAction = username => {
  return async dispatch => {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    };
    return await axios
      .get(
        `${API_BASE_URL}/profiles/${username}`,
        { headers: headers }
      )
      .then(data => {
        dispatch({
          type: PROFILE_FETCHED,
          payload: data.data.profile
        });
      })
      .catch(function(error) {
        dispatch({
          type: PROFILE_FETCH_FAILED,
          payload: error.response.data.errors
        });
      });
  };
};

export const editProfileAction = data => {
  return async dispatch => {
    return axios
      .put(
        `${API_BASE_URL}/profiles/${
          sessionStorage.username
        }/edit`,
        data,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.token
          }
        }
      )
      .then(function(response) {
        dispatch({
          type: PROFILE_EDIT_SUCCESS,
          payload: response.data.profile
        });
        toast.dismiss();
        toast.success("Profile updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false
        });
      });
  };
};

export const followUser = user => {
  return async dispatch => {
    const body = {};
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-type": "application/json"
    };
    return axios
      .post(
        `${API_BASE_URL}/profiles/${user}/follow`,
        body,
        { headers: headers }
      )
      .then(data => {
        if (data.data.errors) {
          toast.dismiss();
          toast.info(`${data.data.errors[0]}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false
          });
          dispatch({
            type: FOLLOW_FAILURE,
            payload: data.data.errors[0]
          });
        } else {
          if (data.data["profile"].message) {
            toast.dismiss();
            toast.success(`${data.data["profile"].message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false
            });
            dispatch({
              type: FOLLOW_SUCCESS,
              payload: data.data["profile"].message
            });
            dispatch(getUsersProfileAction(user));
          } else {
            toast.dismiss();
            toast.info("Failed to follow User", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false
            });
            dispatch({
              type: FOLLOW_FAILURE,
              payload: "Failed to follow User"
            });
          }
        }
      });
  };
};

export const unfollowUser = user => {
  return async dispatch => {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-type": "application/json"
    };

    return axios
      .delete(
        `${API_BASE_URL}/profiles/${user}/follow`,
        { headers: headers }
      )
      .then(data => {
        if (data.data.errors) {
          toast.dismiss();
          toast.info(`${data.data.errors[0]}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false
          });
          dispatch({
            type: UNFOLLOW_FAILURE,
            payload: data.data.errors[0]
          });
        } else {
          if (data.data["profile"].message) {
            toast.dismiss();
            toast.success(`${data.data["profile"].message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false
            });
            dispatch({
              type: UNFOLLOW_SUCCESS,
              payload: data.data["profile"].message
            });
            dispatch(getUsersProfileAction(user));
          } else {
            toast.dismiss();
            toast.info("Failed to unfollow User", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false
            });
            dispatch({
              type: UNFOLLOW_FAILURE,
              payload: "Failed to unfollow User"
            });
          }
        }
      });
  };
};
