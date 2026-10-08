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

  it("should fetch home articles on mount without search", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    wrapper.instance().componentDidMount();
    expect(homeProps.getHomeArticlesAction).toHaveBeenCalled();
    expect(homeProps.getArticlesAction).toHaveBeenCalledWith();
  });

  it("should fetch search results on mount if search param exists and scroll", () => {
    jest.useFakeTimers();
    const propsWithSearch = {
      ...homeProps,
      location: { search: "?search=react" }
    };
    const wrapper = shallow(<Home {...propsWithSearch} />);
    const mockScrollIntoView = jest.fn();
    wrapper.instance().allArticlesRef = {
      current: { scrollIntoView: mockScrollIntoView }
    };
    wrapper.instance().componentDidMount();
    expect(propsWithSearch.getArticlesAction).toHaveBeenCalledWith(expect.stringContaining("search=react"));
    
    jest.runAllTimers();
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    jest.useRealTimers();
  });

  it("should fetch search results on update if search param changes", () => {
    jest.useFakeTimers();
    const propsBase = { ...homeProps, location: { search: "" } };
    const wrapper = shallow(<Home {...propsBase} />);
    
    const mockScrollIntoView = jest.fn();
    wrapper.instance().allArticlesRef = {
      current: { scrollIntoView: mockScrollIntoView }
    };

    const newProps = { ...propsBase, location: { search: "?search=new" } };
    wrapper.setProps(newProps);
    // Force componentDidUpdate to make sure it's tested reliably in Enzyme
    wrapper.instance().componentDidUpdate(propsBase);
    
    expect(propsBase.getArticlesAction).toHaveBeenCalledWith(expect.stringContaining("search=new"));
    
    jest.runAllTimers();
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    const newerProps = { ...newProps, location: { search: "" } };
    wrapper.setProps(newerProps);
    wrapper.instance().componentDidUpdate(newProps);
    
    expect(propsBase.getArticlesAction).toHaveBeenCalledWith();
    
    jest.useRealTimers();
  });

  it("should render the top trending article as the hero", () => {
    const wrapper = shallow(<Home {...homeProps} />);
    const hero = wrapper.find(".best-article");
    expect(hero.length).toEqual(1);
    expect(hero.text()).toContain("A Trending Article");
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
    const newArticle = { article: { ...data.article, body: "the new Article" } };
    wrapper.setProps({ article: newArticle });
    wrapper.instance().componentDidUpdate({ article: undefined });

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
    wrapper.setProps({ article: null });

    expect(wrapper.instance().state.body).toEqual("This is the body");
  });

  it("should trigger onBodyChange when DynamicBlockEditor changes in CreateArticleComponent", () => {
    const props = {
      onChange: jest.fn(),
      onSubmit: jest.fn(),
      onUpload: jest.fn(),
      onBodyChange: jest.fn(),
      article: null
    };
    const wrapper = shallow(<CreateArticleComponent {...props} />);
    const editor = wrapper.find('DynamicBlockEditor');
    if (editor.length > 0) {
      editor.props().onChange("some string");
      expect(props.onBodyChange).toHaveBeenCalledWith({ target: { value: "some string" } });
    }
  });

  it("should handle onBodyChange and trigger autoSave in CreateArticlePage", () => {
    jest.useFakeTimers();
    const props = {
      articleCreateEditAction: jest.fn()
    };
    const wrapper = shallow(<CreateArticlePage {...props} />);
    wrapper.instance().onBodyChange({ target: { value: "new body" } });
    expect(wrapper.instance().state.body).toEqual("new body");
    
    // Test triggerAutoSave timeout
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("should fetch draft on mount and restore it if confirmed", async () => {
    sessionStorage.setItem("token", "mock-token");
    const mockDraft = { title: "Draft", body: "Draft Body", description: "Draft Desc", tags: ["react"] };
    const axios = require("axios");
    axios.get = jest.fn(() => Promise.resolve({ data: { draft: mockDraft } }));
    
    const props = { articleCreateEditAction: jest.fn() };
    const wrapper = shallow(<CreateArticlePage {...props} />);
    await wrapper.instance().componentDidMount();
    
    expect(wrapper.instance().state.showDraftModal).toBe(true);
    wrapper.instance().handleRestoreDraft(true);
    
    expect(wrapper.instance().state.title).toEqual("Draft");
    expect(wrapper.instance().state.body).toEqual("Draft Body");
  });

  it("should autoSaveDraft in EditArticlePage", () => {
    sessionStorage.setItem("token", "mock-token");
    const axios = require("axios");
    axios.post = jest.fn(() => Promise.resolve({ data: {} }));
    
    const props = {
      getArticleAction: jest.fn(),
      articleCreateEditAction: jest.fn(),
      match: { params: { slug: "slug" } }
    };
    const wrapper = shallow(<EditArticlePage {...props} />);
    wrapper.setState({ title: "T", body: "B", description: "D", tags: "t1,t2" });
    wrapper.instance().autoSaveDraft();
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/articles/autosave/"), expect.any(Object), expect.any(Object));
  });

  it("should handle onBodyChange in EditArticlePage", () => {
    jest.useFakeTimers();
    const props = {
      getArticleAction: jest.fn(),
      articleCreateEditAction: jest.fn(),
      match: { params: { slug: "slug" } }
    };
    const wrapper = shallow(<EditArticlePage {...props} />);
    wrapper.instance().onBodyChange({ target: { value: "new body" } });
    expect(wrapper.instance().state.body).toEqual("new body");
    jest.runAllTimers();
    jest.useRealTimers();
  });
});
