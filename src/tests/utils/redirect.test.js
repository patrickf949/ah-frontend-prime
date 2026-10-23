import { redirectTo } from "../../utils/redirect";

describe("redirect utility", () => {
  it("redirects to target URL using window.location", () => {
    redirectTo("http://localhost/#dashboard");
    expect(window.location.href).toBe("http://localhost/#dashboard");
  });
});
