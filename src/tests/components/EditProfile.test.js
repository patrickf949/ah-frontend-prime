import { shallow } from "enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import store from "../../store";

import {
  EditProfile,
  mapStateToProps
} from "../../components/userProfile/EditProfile";

describe("editprofile component success tests", () => {
  const initialState = {
    profile: { isLoading: false, profile: null, message: null }
  };
  const props = {
    profile: {
      full_name: "",
      bio: "",
      image: ""
    },
    onChange: jest.fn(),
    uploadImage: jest.fn(),
    editProfileAction: jest.fn(),
    history: { push: jest.fn() }
  };
  const nextProps = {
    upDateSuccess: true
  };
  const mockFn = jest.fn();
  const mockStore = configureStore([thunk]);
  let store;
  let wrapper = shallow(<EditProfile {...props} />);

  beforeEach(() => {
    store = mockStore(initialState);
    moxios.install();
  });

  afterEach(function() {
    moxios.uninstall();
  });
  it("should render without crushing", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle name change", () => {
    const event = {
      target: {
        name: "full_name",
        value: "emma ogwal"
      }
    };
    wrapper.instance().handleNameChange(event);
    expect(wrapper.instance().state.full_name).toBe("emma ogwal");
  });
  it("should handle bio change", () => {
    const event = {
      target: {
        name: "bio",
        value: "I am the fudge"
      }
    };
    wrapper.instance().handleBioChange(event);
    expect(wrapper.instance().state.bio).toBe("I am the fudge");
  });
  it("should handle image upload", () => {
    global.URL.createObjectURL = jest.fn(() => "blob:fake-url");
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    const event = {
      target: {
        files: [file]
      }
    };
    wrapper.instance().handleImageUpload(event);
    expect(wrapper.instance().state.imageFile).toEqual(file);
    expect(wrapper.instance().state.previewUrl).toBe("blob:fake-url");
  });
  it("should simulate image upload", () => {
    global.URL.createObjectURL = jest.fn(() => "blob:fake-url");
    wrapper.find("#banyati").simulate("change", {
      target: {
        files: [new File(["../../styles/images/profile.jpeg"], "sample.png")]
      }
    });
    expect(props.onChange).toBeCalledTimes(0);
  });
  it("should handle the Submit event", async () => {
    const instance = wrapper.instance();
    const event = {
      preventDefault: jest.fn()
    };
    instance.setState({ full_name: "emma ogwal" });
    
    // Create a mock for this specific test since we added axios calls in handleSubmit
    const axios = require('axios');
    const spyPost = jest.spyOn(axios, 'post').mockResolvedValue({ data: { uploadUrl: "test-url", url: "test-url" } });
    const spyPut = jest.spyOn(axios, 'put').mockResolvedValue({});
    
    await instance.handleSubmit(event);
    expect(instance.state.full_name).toEqual("emma ogwal");
    expect(props.editProfileAction).toBeCalled();
    spyPost.mockRestore();
    spyPut.mockRestore();
  });
  it("should not redirect on edit fail", () => {
    wrapper.setProps({ upDateSuccess: false });
    expect(props.history.push).toBeCalledTimes(0);
  });
  it("should redirect on edit success", () => {
    wrapper.setProps({ ...nextProps });
    expect(props.history.push).toBeCalledWith("/profile/null");
  });
  it("should reject image files larger than 500KB", () => {
    wrapper.instance().setState({ imageFile: null });
    const file = new File(["dummy content"], "large.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 600 * 1024 });
    const event = {
      target: {
        files: [file]
      }
    };
    wrapper.instance().handleImageUpload(event);
    expect(wrapper.instance().state.imageFile).toBeNull();
  });
  it("should handle image upload failure in handleSubmit", async () => {
    const instance = wrapper.instance();
    const event = { preventDefault: jest.fn() };
    const axios = require("axios");
    const spyPost = jest.spyOn(axios, "post").mockRejectedValueOnce({
      response: { data: { error: "Upload error" } }
    });

    instance.setState({
      full_name: "emma",
      imageFile: new File(["dummy"], "sample.png", { type: "image/png" })
    });
    await instance.handleSubmit(event);
    expect(instance.state.isProcessing).toBe(false);
    spyPost.mockRestore();
  });
  it("should do nothing when file selection is cancelled or empty", () => {
    wrapper.instance().handleImageUpload({ target: { files: [] } });
  });
  it("should submit without image file upload", async () => {
    const instance = wrapper.instance();
    instance.setState({ imageFile: null, bio: "new bio", full_name: "new name" });
    await instance.handleSubmit({ preventDefault: jest.fn() });
    expect(props.editProfileAction).toHaveBeenCalled();
  });
  it("should handle image upload error without response object", async () => {
    const instance = wrapper.instance();
    const axios = require("axios");
    const spyPost = jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("Network timeout"));
    instance.setState({ imageFile: new File(["data"], "avatar.png", { type: "image/png" }) });
    await instance.handleSubmit({ preventDefault: jest.fn() });
    expect(instance.state.isProcessing).toBe(false);
    spyPost.mockRestore();
  });
  it("should map state to props", () => {
    const state = {
      profileReducer: {
        profile: null,
        upDateSuccess: false
      }
    };
    expect(mapStateToProps(state)).toEqual({ profile: null, upDateSuccess: false });
  });

  it("should update state when new profile props are received", () => {
    const emptyWrapper = shallow(<EditProfile {...props} profile={{}} />);
    emptyWrapper.setProps({
      profile: {
        full_name: "Received Name",
        bio: "Received Bio",
        image: "https://example.com/received.jpg"
      }
    });
    expect(emptyWrapper.instance().state.full_name).toBe("Received Name");
    expect(emptyWrapper.instance().state.bio).toBe("Received Bio");
    expect(emptyWrapper.instance().state.image).toBe("https://example.com/received.jpg");
  });
});

