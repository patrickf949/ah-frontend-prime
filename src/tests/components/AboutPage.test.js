import React from "react";
import { shallow } from "enzyme";
import AboutPage, { contributors } from "../../components/AboutPage";

describe("AboutPage component", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<AboutPage />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("h1").text()).toBe("A Social Haven for the Creative at Heart");
  });

  it("mentions Andela with correct link under contributors and dev team", () => {
    const wrapper = shallow(<AboutPage />);
    const link = wrapper.find(".andela-link");
    expect(link.length).toBe(1);
    expect(link.props().href).toBe("https://andela.com");
    expect(wrapper.find(".team-heading").text()).toContain("2019");
    expect(wrapper.find("h2").at(0).text()).toBe("Our Origin");
    expect(wrapper.find(".andela-highlight").text()).toBe("Andela");
  });

  it("lists all contributors with PATRICK FITZ first as Software Engineer", () => {
    const wrapper = shallow(<AboutPage />);
    expect(contributors.length).toBeGreaterThanOrEqual(8);
    expect(contributors[0].name).toBe("PATRICK FITZ");
    expect(contributors[0].role).toBe("Software Engineer");

    const cards = wrapper.find(".contributor-card");
    expect(cards.length).toBe(contributors.length);
  });

  it("applies SEO metadata on mount including Patrick Fitz and Andela", () => {
    shallow(<AboutPage />);
    expect(document.title).toContain("Patrick Fitz");
    expect(document.title).toContain("Andela");

    const description = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
    expect(description).toContain("Patrick Fitz");
    expect(description).toContain("Andela");

    const keywords = document.head.querySelector('meta[name="keywords"]')?.getAttribute("content");
    expect(keywords).toContain("Patrick Fitz");
    expect(keywords).toContain("Andela");

    const author = document.head.querySelector('meta[name="author"]')?.getAttribute("content");
    expect(author).toBe("Patrick Fitz");
  });

  it("handles image onerror fallback", () => {
    const wrapper = shallow(<AboutPage />);
    const avatar = wrapper.find(".avatar").at(0);
    const mockTarget = { src: "" };
    avatar.simulate("error", { target: mockTarget });
    expect(mockTarget.src).toBeTruthy();
  });
});
