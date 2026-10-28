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

      const paths = [
        ["/home", "Authors Haven"],
        ["/register", "Register | Authors Haven"],
        ["/create-article", "New Story | Authors Haven"],
        ["/edit-article/sample", "Edit Story | Authors Haven"],
        ["/user-articles", "My Stories | Authors Haven"],
        ["/favorites", "Favorites | Authors Haven"],
        ["/editprofile", "Edit Profile | Authors Haven"],
        ["/profile/testuser", "Profile | Authors Haven"],
        ["/passwordresetemail", "Reset Password | Authors Haven"],
        ["/passwordreset/token123", "Reset Password | Authors Haven"],
        ["/other-random-path", "Authors Haven"],
        ["", "Authors Haven"]
      ];

      paths.forEach(([path, expectedTitle]) => {
        const res = render(
          <MemoryRouter initialEntries={[path]}>
            <RouteElement component={TestComponent} />
          </MemoryRouter>
        );
        expect(document.title).toBe(expectedTitle);
        res.unmount();
      });
    });

    it("handles components with custom displayName or fallback name", () => {
      const CustomNamed = () => <div data-testid="custom">Named</div>;
      CustomNamed.displayName = "SpecialComponent";
      const WrappedCustom = withRouter(CustomNamed);
      expect(WrappedCustom.displayName).toBe("withRouter(SpecialComponent)");

      const Anonymous = function() {
        return <div data-testid="anon">Anon</div>;
      };
      Object.defineProperty(Anonymous, "name", { value: "" });
      const WrappedAnon = withRouter(Anonymous);
      expect(WrappedAnon.displayName).toBe("withRouter(Component)");
    });
  });
});
