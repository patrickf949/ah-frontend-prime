import rootReducer from "../../reducers/rootReducer";

describe("rootReducer", () => {
  it("initializes root state with all reducers", () => {
    const state = rootReducer(undefined, { type: "@@INIT" });
    expect(state).toHaveProperty("auth_login");
    expect(state).toHaveProperty("getArticlesReducer");
    expect(state).toHaveProperty("homeArticlesReducer");
    expect(state).toHaveProperty("getArticleReducer");
    expect(state).toHaveProperty("createArticleReducer");
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("socialAuthReducer");
    expect(state).toHaveProperty("passReset");
    expect(state).toHaveProperty("passChange");
    expect(state).toHaveProperty("profileReducer");
    expect(state).toHaveProperty("followsUnfollowsReducer");
    expect(state).toHaveProperty("comments");
    expect(state).toHaveProperty("getComments");
  });
});
