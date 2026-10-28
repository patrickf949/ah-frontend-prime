import { getDefaultAvatar } from "../../utils/avatar";

describe("avatar utils", () => {
  it("should return ui-avatars URL with given name", () => {
    const url = getDefaultAvatar("Patrick Fitz");
    expect(url).toContain("ui-avatars.com");
    expect(url).toContain("name=Patrick%20Fitz");
    expect(url).toContain("background=03a9f4");
  });

  it("should fall back to User when name is empty or undefined", () => {
    expect(getDefaultAvatar("")).toContain("name=User");
    expect(getDefaultAvatar("   ")).toContain("name=User");
    expect(getDefaultAvatar(null)).toContain("name=User");
    expect(getDefaultAvatar()).toContain("name=User");
  });
});
