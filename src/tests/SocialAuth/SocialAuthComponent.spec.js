import React from "react";
import { shallow } from "enzyme";
import { SocialAuth } from "../../components/SocialAuth";
import FacebookLogin from "@greatsumini/react-facebook-login";

describe("SocialAuth component", () => {
  it("should render without fail", () => {
    const wrapper = shallow(<SocialAuth />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onClick when Facebook button is clicked", () => {
    const wrapper = shallow(<SocialAuth />);
    const facebookLogin = wrapper.find(FacebookLogin);
    const renderProp = facebookLogin.props().render;
    const onClickMock = jest.fn();
    const buttonWrapper = shallow(renderProp({ onClick: onClickMock }));
    
    buttonWrapper.simulate("click");
    expect(onClickMock).toHaveBeenCalled();
  });
});
