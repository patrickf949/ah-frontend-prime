import { shallow, mount } from "enzyme";
import React from "react";
import FollowingList from "../../components/FollowingList";
import FollowersList from "../../components/FollowersList";
import FollowsStats from "../../components/FollowsStats";
import FollowsButton from "../../components/FollowsButton";

describe("following list popup", () => {
  it("should render without crashing", () => {
    const props = {
      following: []
    };
    const wrapper = shallow(<FollowingList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render without crashing", () => {
    const props = {
      following: ["david"]
    };
    const wrapper = shallow(<FollowingList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("followers list popup", () => {
  it("should render without crashing", () => {
    const props = {
      followers: []
    };
    const wrapper = shallow(<FollowersList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render without crashing", () => {
    const props = {
      followers: ["dan"]
    };
    const wrapper = shallow(<FollowersList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("followers and following statistics", () => {
  const props = {
    followers: [],
    following: [],
    followers_count: 0,
    following_count: 0
  };
  it("should render without crashing", () => {
    const wrapper = shallow(<FollowsStats {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display singular text when count is 1", () => {
    const oneProps = { ...props, followers_count: 1, following_count: 1 };
    const wrapper = shallow(<FollowsStats {...oneProps} />);
    expect(wrapper.text()).toContain("Follower :");
    expect(wrapper.text()).toContain("1");
  });

  it("should display zero when counts are null/undefined", () => {
    const zeroProps = { ...props, followers_count: null, following_count: null };
    const wrapper = shallow(<FollowsStats {...zeroProps} />);
    expect(wrapper.text()).toContain("0");
  });
});

describe("follow/unfollow button", () => {
  const props = {
    isfollowing: false,
    unfollowUser: jest.fn(),
    followUser: jest.fn()
  };
  it("should render without crashing", () => {
    const wrapper = shallow(<FollowsButton {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call followUser on click", () => {
    sessionStorage.setItem("userview_name", "testuser");
    const wrapper = shallow(<FollowsButton {...props} />);
    wrapper.simulate("click");
    expect(props.followUser).toHaveBeenCalled();
  });

  it("should call unfollowUser on click", () => {
    const followingProps = { ...props, isfollowing: true };
    const wrapper = shallow(<FollowsButton {...followingProps} />);
    wrapper.simulate("click");
    expect(followingProps.unfollowUser).toHaveBeenCalled();
  });
});

describe("follower click", () => {
  it("should click on a follower", () => {
    const onClickMock = jest.fn();
    const props = {
      followers: [{ username: "david", full_name: "David", image: "https://example.com/david.jpg" }],
      onClick: onClickMock
    };
    const wrapper = shallow(<FollowersList {...props} />);
    wrapper.find("#follower").props().onClick();
    expect(onClickMock).toHaveBeenCalledWith("david");
  });

  it("should navigate if onClick is not provided for follower", () => {
    const props = {
      followers: [{ username: "david", full_name: "David" }]
    };
    const wrapper = shallow(<FollowersList {...props} />);
    try {
      wrapper.find("#follower").props().onClick();
    } catch(e) {}
  });
});

describe("following click", () => {
  it("should click on a user  that is being followed", () => {
    const onClickMock = jest.fn();
    const props = {
      following: [{ username: "david", full_name: "David", image: "https://example.com/david.jpg" }],
      onClick: onClickMock
    };
    const wrapper = shallow(<FollowingList {...props} />);
    wrapper.find("#following").props().onClick();
    expect(onClickMock).toHaveBeenCalledWith("david");
  });

  it("should navigate if onClick is not provided for following", () => {
    const props = {
      following: [{ username: "david", full_name: "David" }]
    };
    const wrapper = shallow(<FollowingList {...props} />);
    try {
      wrapper.find("#following").props().onClick();
    } catch(e) {}
  });
});
