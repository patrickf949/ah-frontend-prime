import React from "react";
import { shallow } from "enzyme";
import AboutPage, { contributors } from "../../components/AboutPage";

describe("AboutPage component", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<AboutPage />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("h1").text()).toBe("A Social Haven for the Creative at Heart");
  });

  it("mentions Andela with correct link", () => {
    const wrapper = shallow(<AboutPage />);
    const link = wrapper.find(".andela-link");
    expect(link.length).toBe(1);
    expect(link.props().href).toBe("https://andela.com");
    expect(wrapper.find(".about-story-card").text()).toContain("2019");
  });

  it("lists all contributors with PATRICK FITZ as lead", () => {
    const wrapper = shallow(<AboutPage />);
    expect(contributors.length).toBeGreaterThanOrEqual(8);
    expect(contributors[0].name).toBe("PATRICK FITZ");
    expect(contributors[0].isLead).toBe(true);

    const cards = wrapper.find(".contributor-card");
    expect(cards.length).toBe(contributors.length);
    expect(wrapper.find(".lead-tag").length).toBe(1);
  });

  it("handles image onerror fallback", () => {
    const wrapper = shallow(<AboutPage />);
    const avatar = wrapper.find(".avatar").at(0);
    const mockTarget = { src: "" };
    avatar.simulate("error", { target: mockTarget });
    expect(mockTarget.src).toBeTruthy();
  });
});
