import React from "react";
import { Home } from "../../components/home";

import { shallow } from "enzyme";

import data from "../mock_data/moxios_mock";
import { SingleArticleComponent } from "../../components/articles/singleArticle";
import CreateArticleComponent from "../../components/articles/createArticleComponent";
import { CreateArticlePage } from "../../components/articles/createArticlePage";

const props = {
  articles: data.articles,
  getArticlesAction: jest.fn()
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
  it("should render the home page", () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper).toMatchSnapshot();
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
});