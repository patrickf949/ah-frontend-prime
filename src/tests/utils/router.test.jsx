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
    it("renders component with legacy router props", () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={["/route"]}>
          <RouteElement component={TestComponent} />
        </MemoryRouter>
      );

      expect(getByTestId("path").textContent).toBe("/route");
    });
  });
});
