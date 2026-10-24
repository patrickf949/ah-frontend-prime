import data from "../mock_data/moxios_mock";
import {
  mapStateToProps,
  SingleArticleComponent as DumpProfileContainer
} from "../../components/articles/singleArticle";
import { shallow } from "enzyme";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

describe("Component for getting single Articles", () => {
  it("should tests mapstateToprops", () => {
    const state = {
      getArticleReducer: { article: data.article },
      profileReducer: { isfollowing: false }
    };
    expect(mapStateToProps(state)).toEqual({
      article: data.article,
      isfollowing: false
    });
  });

  it("should call handleLike function", () => {
    const props = {
      match: {
        params: {
          slug: "truth"
        }
      },
      getArticleAction: jest.fn(),
      likes: 1,
      dislikes: 0,
      isfollowing: true,
      article: {},
      likeArticle: jest.fn(),
      dislikeArticle: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    wrapper.instance().handlelike("truth");
    expect(wrapper.instance().props.likeArticle).toBeCalled();
  });

  it("should call handleDisLike function", () => {
    const props = {
      match: {
        params: {
          slug: "truth"
        }
      },
      getArticleAction: jest.fn(),
      likes: 1,
      dislikes: 0,
      isfollowing: true,
      article: {},
      likeArticle: jest.fn(),
      dislikeArticle: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    wrapper.instance().handledislike("truth");
    expect(wrapper.instance().props.dislikeArticle).toBeCalled();
  });

  it("should receive props", () => {
    const props = {
      match: {
        params: {
          slug: "truth"
        }
      },
      getArticleAction: jest.fn(),
      likes: 1,
      dislikes: 0,
      isfollowing: true,
      article: {},
      likeArticle: jest.fn(),
      dislikeArticle: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const newProps = {
      likes: 1,
      dislikes: 0
    };

    wrapper.setProps(newProps);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call reactArticle when an emoji is clicked", () => {
    const props = {
      match: {
        params: {
          slug: "truth"
        }
      },
      getArticleAction: jest.fn(),
      likes: 1,
      dislikes: 0,
      isfollowing: true,
      article: { article: data.article },
      reactions: {
        total: 2,
        breakdown: [
          { reaction: "like", emoji: "👍", count: 1 },
          { reaction: "fire", emoji: "🔥", count: 1 }
        ]
      },
      likeArticle: jest.fn(),
      dislikeArticle: jest.fn(),
      reactArticle: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    wrapper.instance().handleReact("fire");
    expect(props.reactArticle).toHaveBeenCalledWith("truth", "fire");
  });

  it("should render the emoji reaction bar without like/dislike", () => {
    const props = {
      match: {
        params: {
          slug: "truth"
        }
      },
      getArticleAction: jest.fn(),
      likes: 1,
      dislikes: 0,
      isfollowing: true,
      article: { article: data.article },
      reactions: {
        total: 3,
        breakdown: [
          { reaction: "like", emoji: "👍", count: 1 },
          { reaction: "fire", emoji: "🔥", count: 2 }
        ]
      },
      likeArticle: jest.fn(),
      dislikeArticle: jest.fn(),
      reactArticle: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const bar = wrapper.find(".reaction-bar");
    expect(bar.length).toEqual(1);
    expect(bar.text()).toContain("🔥 2");
    expect(bar.text()).not.toContain("👍");
  });

  it("should fetch article on mount and handle loading state", () => {
    const props = {
      match: { params: { slug: "truth" } },
      getArticleAction: jest.fn(),
      loading: true
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    wrapper.instance().componentDidMount();
    expect(props.getArticleAction).toHaveBeenCalledWith("truth");
    // Verify loading spinner is rendered
    expect(wrapper.find(ThreeDots).length).toBe(1);
  });

  it("should fetch article on update if slug changes", () => {
    const props = {
      match: { params: { slug: "truth" } },
      getArticleAction: jest.fn(),
      loading: false
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const prevProps = { match: { params: { slug: "old" } } };
    wrapper.instance().componentDidUpdate(prevProps);
    expect(props.getArticleAction).toHaveBeenCalledWith("truth");
  });

  it("should parse blocks string in renderBody safely", () => {
    const props = {
      match: { params: { slug: "truth" } },
      getArticleAction: jest.fn(),
      article: { article: { ...data.article, body: '[{"type":"text","content":"<p>hi</p>"},{"type":"image","url":"hi.png"}]' } }
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const children = wrapper.find('.article-body').props().children;
    expect(children.length).toBe(2);
    expect(children[0].props.dangerouslySetInnerHTML.__html).toBe("<p>hi</p>");
    expect(children[1].props.children.props.src).toBe("hi.png");
  });

  it("should catch errors in renderBody and render raw text", () => {
    const props = {
      match: { params: { slug: "truth" } },
      getArticleAction: jest.fn(),
      article: { article: { ...data.article, body: 'Invalid JSON {}' } }
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const children = wrapper.find('.article-body').props().children;
    expect(children.props.children).toBe("Invalid JSON {}");
  });

  it("should handle SEO properties if provided", () => {
    const seoMock = { title: "SEO Title" };
    
    const props = {
      match: { params: { slug: "truth" } },
      getArticleAction: jest.fn()
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    const newProps = { article: { article: { seo: seoMock, author: { image: "", username: "test" } } } };
    // This calls applyArticleSeo but we're just checking that the line doesn't crash
    // since seo is defined.
    wrapper.setProps(newProps);
  });

  it("should apply SEO on mount when article is already cached", () => {
    const props = {
      match: { params: { slug: "cached-slug" } },
      getArticleAction: jest.fn(),
      article: {
        article: {
          title: "Cached Story",
          seo: { meta_title: "Cached Story" },
          author: { username: "author", image: "" }
        }
      }
    };
    const wrapper = shallow(<DumpProfileContainer {...props} />);
    wrapper.instance().componentDidMount();
    expect(document.title).toBe("Cached Story — Authors' Haven");
  });
});
