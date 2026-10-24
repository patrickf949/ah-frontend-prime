import React from "react";
import { shallow } from "enzyme";
import Footer from "../../components/Footer";

describe("Footer component", () => {
  it("renders footer with navigation links", () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".footer-logo").text()).toBe("Authors Haven");
    expect(wrapper.find(".footer-link").length).toBe(3);
  });

  it("links to Andela website", () => {
    const wrapper = shallow(<Footer />);
    const link = wrapper.find("a[href='https://andela.com']");
    expect(link.length).toBe(1);
    expect(link.props().href).toBe("https://andela.com");
    expect(link.props().target).toBe("_blank");
  });
});
