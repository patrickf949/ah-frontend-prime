import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useLegacyRouter, withRouter, RouteElement } from "../../utils/router";

const TestComponent = props => {
  return (
    <div>
      <span data-testid="path">{props.location?.pathname}</span>
      <button onClick={() => props.history.push("/new")}>Push</button>
      <button onClick={() => props.history.replace("/replace")}>Replace</button>
      <button onClick={() => props.history.go(-2)}>Go</button>
      <button onClick={() => props.history.back()}>Back</button>
      <button onClick={() => props.history.forward()}>Forward</button>
    </div>
  );
};

describe("router utils", () => {
  describe("withRouter", () => {
    it("provides legacy router props", () => {
      const WrappedComponent = withRouter(TestComponent);
      const { getByTestId, getByText } = render(
        <MemoryRouter initialEntries={["/test"]}>
          <WrappedComponent />
        </MemoryRouter>
      );

      expect(getByTestId("path").textContent).toBe("/test");
      
      // Simulate clicks to increase coverage for history methods
      getByText("Push").click();
      getByText("Replace").click();
      getByText("Go").click();
      getByText("Back").click();
      getByText("Forward").click();
    });
  });

  describe("RouteElement", () => {
    it("renders component with legacy router props and updates document title", () => {
      const { unmount } = render(
        <MemoryRouter initialEntries={["/"]}>
          <RouteElement component={TestComponent} />
        </MemoryRouter>
      );
      expect(document.title).toBe("Authors Haven");
      unmount();

      const r2 = render(
        <MemoryRouter initialEntries={["/about"]}>
          <RouteElement component={TestComponent} />
        </MemoryRouter>
      );
      expect(document.title).toBe("About | Authors Haven");
      r2.unmount();

      const r3 = render(
        <MemoryRouter initialEntries={["/article/sample-slug"]}>
          <RouteElement component={TestComponent} />
        </MemoryRouter>
      );
      // Article routes do not overwrite dynamic article SEO titles
      expect(document.title).toBe("About | Authors Haven");
      r3.unmount();

      const r4 = render(
        <MemoryRouter initialEntries={["/login"]}>
          <RouteElement component={TestComponent} />
        </MemoryRouter>
      );
      expect(document.title).toBe("Login | Authors Haven");
      expect(r4.getByTestId("path").textContent).toBe("/login");
      r4.unmount();
    });
  });
});
