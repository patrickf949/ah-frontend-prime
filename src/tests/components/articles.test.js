import React from "react";
import { Home } from "../../components/home";

import { shallow } from "enzyme";

import data from "../mock_data/moxios_mock";
import { SingleArticleComponent } from "../../components/articles/singleArticle";
import CreateArticleComponent from "../../components/articles/createArticleComponent";
import { CreateArticlePage } from "../../components/articles/createArticlePage";
import { EditArticlePage } from "../../components/articles/editArticlePage";

const props = {
  articles: data.articles,
  previous: "",
  next: "",
  getArticlesAction: jest.fn(),
  fetchNext: jest.fn(),
  fetchPrevious: jest.fn()
};

const homeArticle = (slug, title, count) => ({
  slug,
  title,
  description: `Description of ${title} that is long enough to be cut`,
  createdAt: "2019-05-17T04:38:14.045441Z",
  image: "",
  reading_time: "1 minute read",
  author: { username: "alice" },
  reactions: {
    total: count,
    breakdown: [{ reaction: "fire", emoji: "🔥", count }]
  }
});

const homeProps = {
  ...props,
  getHomeArticlesAction: jest.fn(),
  latest: [
    homeArticle("hero-article", "The Hero Article Title", 0),
    homeArticle("second-latest", "Second Latest Article", 1)
  ],
  trending: [homeArticle("trending-article", "A Trending Article", 5)],
  popular: [homeArticle("popular-article", "A Popular Article", 9)]
};

const props1 = {
  getArticleAction: jest.fn(),
  match: {
    params: {
      slug: "this-is-kev"
    }
  }
};

describe("Article Components", () => {
  let homeWrapper;
  beforeEach(() => {
    homeWrapper = shallow(<Home {...props} />);
  });
  it("should render the home page", () => {
    expect(homeWrapper).toMatchSnapshot();
  });

  it("should fetch home articles on mount", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    wrapper.instance().componentDidMount();
    expect(homeProps.getHomeArticlesAction).toHaveBeenCalled();
  });

  it("should render the latest article as the hero", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    const hero = wrapper.find(".best-article");
    expect(hero.length).toEqual(1);
    expect(hero.text()).toContain("The Hero Article Title");
  });

  it("should render trending and popular sections from props", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    const text = wrapper.find(".big-container").text();
    expect(text).toContain("Trending Articles");
    expect(text).toContain("Popular Articles");
    expect(text).toContain("A Trending Article".substring(0, 30));
    expect(text).toContain("A Popular Article".substring(0, 30));
  });

  it("should show emoji reaction counts on article cards", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    expect(wrapper.find(".card-reactions").length).toBeGreaterThan(0);
    expect(wrapper.find(".big-container").text()).toContain("🔥 5");
  });

  it("should render without a hero when there are no latest articles", () => {
    const wrapper = shallow(<Home {...homeProps} latest={[]} />);
    expect(wrapper.find(".best-article").length).toEqual(0);
  });

  it("renders the single article page", () => {
    const wrapper = shallow(<SingleArticleComponent {...props1} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("renders the single article page without an article", () => {
    props1.article = null;
    const wrapper = shallow(<SingleArticleComponent {...props1} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("renders the single article page without an article image", () => {
    props1.article = data.articles[0];
    props1.article.image = null;
    const wrapper = shallow(<SingleArticleComponent {...props1} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should not regress", () => {
    const event = {
      target: {
        files: ["../../styles/images/profile.png", "sample.png"]
      }
    };
    const props = {
      onChange: jest.fn(),
      onSubmit: jest.fn(),
      onUpload: jest.fn()
    };

    const wrapper = shallow(<CreateArticleComponent {...props} />);
    wrapper.find("#fitz").simulate("change", event);
    expect(wrapper).toMatchSnapshot();
  });

  it("renders the create article page", () => {
    const wrapper = shallow(<CreateArticlePage />);
    wrapper.setProps({ article: "<div> we rocked so well</div>" });

    expect(wrapper).toMatchSnapshot();
  });

  it("renders the edit article page", () => {
    const event = {
      preventDefault: () => {},
      target: {
        name: "body",
        value: "This is the body"
      }
    };
    const props = {
      getArticleAction: jest.fn(),
      articleCreateEditAction: jest.fn(),
      match: {
        params: {
          slug: "this-is-the-slug"
        }
      }
    };
    const wrapper = shallow(<EditArticlePage {...props} />);
    wrapper.instance().onChange(event);
    wrapper.instance().onSubmit(event);
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle on change", () => {
    const event = {
      preventDefault: () => {},
      target: {
        name: "body",
        value: "This is the body"
      }
    };
    const props = {
      articleCreateEditAction: jest.fn()
    };
    const wrapper = shallow(<CreateArticlePage {...props} />);
    wrapper.instance().onChange(event);
    wrapper.instance().onSubmit(event);

    expect(wrapper.instance().state.body).toEqual("This is the body");
  });
  it("should fetch next page", () => {
    homeWrapper.instance().fetchNext();
    expect(props.getArticlesAction).toHaveBeenCalled();
  });
  it("should fetch previous page", () => {
    homeWrapper.instance().fetchPrevious();
    expect(props.getArticlesAction).toHaveBeenCalled();
  });
  it("should simulate onclick for next page", () => {
    homeWrapper
      .find(".aken")
      .at(0)
      .simulate("click");

    expect(props.fetchNext).toHaveBeenCalledTimes(0);
  });
  it("should simulate onclick for previous page", () => {
    homeWrapper
      .find(".eian")
      .at(0)
      .simulate("click");

    expect(props.fetchPrevious).toHaveBeenCalledTimes(0);
  });
  it("Edit article page should handle on change", () => {
    const event = {
      preventDefault: () => {},
      target: {
        name: "body",
        value: "This is the body"
      }
    };
    const props = {
      getArticleAction: jest.fn(),
      articleCreateEditAction: jest.fn(),
      match: {
        params: {
          slug: "this-is-the-slug"
        }
      }
    };
    const wrapper = shallow(<EditArticlePage {...props} />);
    wrapper.instance().onChange(event);
    wrapper.instance().onSubmit(event);
    wrapper
      .instance()
      .componentWillReceiveProps({ article: { article: data.article } });

    expect(wrapper.instance().state.body).toEqual("the new Article");
  });
  it("Edit article page should handle in case article is null", () => {
    const event = {
      preventDefault: () => {},
      target: {
        name: "body",
        value: "This is the body"
      }
    };
    const props = {
      getArticleAction: jest.fn(),
      articleCreateEditAction: jest.fn(),
      match: {
        params: {
          slug: "this-is-the-slug"
        }
      }
    };
    const wrapper = shallow(<EditArticlePage {...props} />);
    wrapper.instance().onChange(event);
    wrapper.instance().onSubmit(event);
    wrapper.instance().componentWillReceiveProps(null);

    expect(wrapper.instance().state.body).toEqual("This is the body");
  });
});
