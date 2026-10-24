import React from "react";
import { shallow, mount } from "enzyme";
import {
  UserArticles,
  mapStateToProps
} from "../../components/articles/userArticles";
import { Provider } from "react-redux";
import store from "../../store";
import data from "../mock_data/moxios_mock";
import { BrowserRouter } from "react-router-dom";

const props = {
  articles: data.articles,
  getArticlesAction: jest.fn(),
  deleteArticleAction: jest.fn(),
  deleteArticle: jest.fn()
};

describe("user article tests", () => {
  it("User articles should be tested", () => {
    const event = {
      preventDefault: () => {},
      target: {
        name: "body",
        value: "This is the body"
      }
    };

    const wrapper = shallow(<UserArticles {...props} />);
    wrapper.instance().deleteArticle("slug", event);

    expect(wrapper).toMatchSnapshot();
  });

  it("Should be able to delete on button click", () => {
    const wrapper = shallow(<UserArticles {...props} />);

    wrapper
      .find(".delete")
      .at(0)
      .simulate("click", "slug");

    expect(props.deleteArticleAction).toHaveBeenCalled();
  });

  it("should map state to props", () => {
    const appState = {
      getArticlesReducer: {
        articles: data.articles,
        loading: false
      },
      auth: {
        isAutheticated: true,
        user: {
          token: "xxxxxx"
        }
      }
    };

    const componentState = {
      articles: data.articles,
      loading: false
    };
    expect(mapStateToProps(appState)).toEqual(componentState);
  });

  it("should render loader when loading and no articles yet", () => {
    const loadingWrapper = shallow(<UserArticles {...props} articles={[]} loading={true} />);
    expect(loadingWrapper.find(".user-articles-loader").length).toBe(1);
  });
  it("should fetch articles on mount", () => {
    sessionStorage.setItem("email", "test@test.com");
    const localProps = { ...props, getArticlesAction: jest.fn() };
    const wrapper = shallow(<UserArticles {...localProps} />);
    wrapper.instance().componentDidMount();
    expect(localProps.getArticlesAction).toHaveBeenCalledWith(expect.stringContaining("?email=test@test.com"));
  });

  it("should handle article image onError fallback", () => {
    const wrapper = shallow(<UserArticles {...props} />);
    const img = wrapper.find(".img-tile").at(0);
    const mockTarget = { src: "", onerror: jest.fn() };
    img.simulate("error", { target: mockTarget });
    expect(mockTarget.src).toBeTruthy();
  });

  it("should render empty state when no articles exist", () => {
    const emptyWrapper = shallow(<UserArticles {...props} articles={[]} loading={false} />);
    expect(emptyWrapper.text()).toContain("You have not yet created any articles sofar");
  });

  it("should render custom article image when available", () => {
    const articleWithImage = [{ ...data.articles[0], image: "https://example.com/art.jpg" }];
    const wrapper = shallow(<UserArticles {...props} articles={articleWithImage} />);
    expect(wrapper.find(".img-tile").props().src).toBe("https://example.com/art.jpg");
  });
});
