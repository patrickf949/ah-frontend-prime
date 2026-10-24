import React from "react";
import { shallow } from "enzyme";
import Footer from "../../components/Footer";

describe("Footer component", () => {
  it("renders footer with navigation links", () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".footer-logo").text()).toBe("Authors Haven");
    expect(wrapper.find(".footer-link").length).toBe(2);
  });

  it("links to home and about pages", () => {
    const wrapper = shallow(<Footer />);
    const links = wrapper.find(".footer-link");
    expect(links.at(0).props().to).toBe("/");
    expect(links.at(1).props().to).toBe("/about");
  });
});
