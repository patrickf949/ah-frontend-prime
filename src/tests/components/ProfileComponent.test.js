import { shallow } from "enzyme";
import React from "react";
import ProfileComponent from "../../components/userProfile/ProfileComponent";
import EditProfileContainer from "../../containers/profile/EditProfileContainer";

describe("profileComponent tests", () => {
  const props = {
    onSubmit: jest.fn(),
    errors: null,
    generalError: ""
  };
  it("should render without crushing", () => {
    const wrapper = shallow(<ProfileComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render edit profile link when user is owner", () => {
    const ownerProps = {
      ...props,
      isOwner: true,
      image: "https://example.com/avatar.jpg"
    };
    const wrapper = shallow(<ProfileComponent {...ownerProps} />);
    expect(wrapper.find(".btn-outline-success").length).toBe(1);
    expect(wrapper.find("img").props().src).toBe("https://example.com/avatar.jpg");
  });

  it("should render follows button when user is not owner and fallback avatar", () => {
    const nonOwnerProps = {
      ...props,
      isOwner: false,
      image: ""
    };
    const wrapper = shallow(<ProfileComponent {...nonOwnerProps} />);
    expect(wrapper.find("FollowsButton").length).toBe(1);
    expect(wrapper.find("img").props().src).toContain("ui-avatars.com");
  });
});

describe("edit profile container tests", () => {
  const props = {
    onSubmit: jest.fn(),
    image: "",
    bio: "",
    full_name: ""
  };
  it("should render without crushing", () => {
    const wrapper = shallow(<EditProfileContainer {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
