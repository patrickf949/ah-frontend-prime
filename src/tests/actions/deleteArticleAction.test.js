import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";
import { DELETE_ARTICLE_SUCCESS } from "../../actions/types";
import { deleteArticleAction } from "../../actions/deleteArticleAction";

const middleWare = [thunk];

const mockStore = configureStore(middleWare);

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn()
  }
}));

describe("Action for getting Article", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it("Should delete an article and trigger onClose", () => {
    const store = mockStore({});
    const props = { history: { go: jest.fn() } };
    moxios.wait(() => {
      const requestM = moxios.requests.mostRecent();
      requestM.respondWith({
        status: 200,
        response: {
          message: "Article has been successfully deleted"
        }
      });
    });
    const expectedAction = [
      {
        type: DELETE_ARTICLE_SUCCESS,
        payload: {
          message: "Article has been successfully deleted"
        }
      }
    ];
    return store.dispatch(deleteArticleAction("test-slug", props)).then(() => {
      expect(store.getActions()).toEqual(expectedAction);
      
      const { toast } = require("react-toastify");
      expect(toast.success).toHaveBeenCalled();
      
      // Trigger the onClose callback
      const successOptions = toast.success.mock.calls[0][1];
      successOptions.onClose();
      
      expect(props.history.go).toHaveBeenCalledWith(0);
    });
  });
});
