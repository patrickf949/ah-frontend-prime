import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import { FETCH_ARTICLE_SUCCESS } from "../../actions/types";
import { getArticleAction } from "../../actions/getArticle";
import data from "../mock_data/moxios_mock";

const middleWare = [thunk];

const mockStore = configureStore(middleWare);

describe("Action for getting Article", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("Should fetch an article", () => {
    const store = mockStore({});
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 200,
        response: {
          article: data.article
        }
      });
    });
    const expectedAction = [
      {
        type: FETCH_ARTICLE_SUCCESS,
        payload: {
          article: data.article
        }
      }
    ];
    return store.dispatch(
      getArticleAction(data.article1, "https://www.makesite.com/", "post", {
        props: {
          history: { push: jest.fn() }
        }
      })
    );
    return store.dispatch(getArticleAction()).then(() => {
      expect(store.getActions()).toEqual(expectedAction);
    });
  });
});
