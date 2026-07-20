import React from "react";
import FavoritesPage from "../../components/articles/favoritesPage";
import { shallow } from "enzyme";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));

const mockReaction = (reaction, title) => ({
  id: 1,
  reaction,
  emoji: "🔥",
  article: {
    slug: `${reaction}-slug`,
    title,
    description: "Mock description",
    reading_time: "1 min read",
    author: { username: "bob" },
    reactions: {
      breakdown: [{ reaction, emoji: "🔥", count: 1 }]
    }
  }
});

describe("FavoritesPage component", () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      history: {
        push: jest.fn()
      }
    };
    sessionStorage.clear();
    axios.get.mockClear();
  });

  it("should redirect to login if token is missing", () => {
    wrapper = shallow(<FavoritesPage {...props} />);
    wrapper.instance().componentDidMount();
    expect(props.history.push).toHaveBeenCalledWith("/login");
  });

  it("should render loader when loading is true", () => {
    sessionStorage.setItem("token", "mock-token");
    wrapper = shallow(<FavoritesPage {...props} />);
    expect(wrapper.state().loading).toBe(true);
  });

  it("should render error message when error occurs", () => {
    sessionStorage.setItem("token", "mock-token");
    wrapper = shallow(<FavoritesPage {...props} />);
    wrapper.setState({ loading: false, error: "Failed to load" });
    expect(wrapper.text()).toContain("Failed to load");
  });

  it("should render empty state if no reactions exist", () => {
    sessionStorage.setItem("token", "mock-token");
    wrapper = shallow(<FavoritesPage {...props} />);
    wrapper.setState({ loading: false, reactions: [] });
    expect(wrapper.text()).toContain("You haven't reacted to any articles yet!");
  });

  it("should render tabs sorted by count with dislike last", () => {
    sessionStorage.setItem("token", "mock-token");
    const reactions = [
      mockReaction("dislike", "Disliked Article"),
      mockReaction("dislike", "Disliked Article"),
      mockReaction("like", "Liked Article"),
      mockReaction("clap", "Clapped Article"),
      mockReaction("clap", "Another Clapped Article"),
      mockReaction("clap", "Yet Another Clapped Article")
    ];

    wrapper = shallow(<FavoritesPage {...props} />);
    wrapper.setState({ loading: false, reactions, activeTab: "clap" });

    const instance = wrapper.instance();
    const sortedTabs = instance.getSortedTabs();

    // Counts: clap = 3, dislike = 2, like = 1
    // Expected order: clap (3), like (1), dislike (2) (dislike is always last regardless of count)
    expect(sortedTabs[0].reaction).toBe("clap");
    expect(sortedTabs[1].reaction).toBe("like");
    expect(sortedTabs[2].reaction).toBe("dislike");

    // Match snapshot of successfully rendered tabs
    expect(wrapper).toMatchSnapshot();
  });
});
