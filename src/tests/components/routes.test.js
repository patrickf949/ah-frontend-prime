import React from "react";
import { shallow } from "enzyme";
import Routes from "../../components/routes";

describe("Routes component", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<Routes />);
    expect(wrapper.exists()).toBe(true);
  });
});
