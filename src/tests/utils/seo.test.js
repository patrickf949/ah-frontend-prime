import { applyArticleSeo, applyPageSeo } from "../../utils/seo";

const seoPayload = {
  meta_title: "My Great Article",
  meta_description: "A description of the article",
  keywords: ["django", "seo"],
  canonical_url: "http://localhost:3000/article/my-great-article",
  og: {
    "og:type": "article",
    "og:title": "My Great Article",
    "article:tag": ["django", "seo"]
  },
  twitter: {
    "twitter:card": "summary",
    "twitter:title": "My Great Article"
  }
};

describe("applyArticleSeo", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("sets the document title", () => {
    applyArticleSeo(seoPayload);
    expect(document.title).toEqual("My Great Article — Authors' Haven");
  });

  it("sets description, keywords and canonical link", () => {
    applyArticleSeo(seoPayload);
    expect(
      document.head
        .querySelector('meta[name="description"]')
        .getAttribute("content")
    ).toEqual("A description of the article");
    expect(
      document.head
        .querySelector('meta[name="keywords"]')
        .getAttribute("content")
    ).toEqual("django, seo");
    expect(
      document.head
        .querySelector('link[rel="canonical"]')
        .getAttribute("href")
    ).toEqual("http://localhost:3000/article/my-great-article");
  });

  it("sets Open Graph and Twitter tags, skipping array values", () => {
    applyArticleSeo(seoPayload);
    expect(
      document.head
        .querySelector('meta[property="og:title"]')
        .getAttribute("content")
    ).toEqual("My Great Article");
    expect(
      document.head.querySelector('meta[property="article:tag"]')
    ).toBeNull();
    expect(
      document.head
        .querySelector('meta[name="twitter:card"]')
        .getAttribute("content")
    ).toEqual("summary");
  });

  it("updates existing tags instead of duplicating them", () => {
    applyArticleSeo(seoPayload);
    applyArticleSeo({ ...seoPayload, meta_description: "Updated" });
    const tags = document.head.querySelectorAll('meta[name="description"]');
    expect(tags.length).toEqual(1);
    expect(tags[0].getAttribute("content")).toEqual("Updated");
  });

  it("does nothing without a payload", () => {
    applyArticleSeo(null);
    expect(document.title).toEqual("");
  });

  it("handles missing content and url gracefully", () => {
    applyArticleSeo({
      meta_title: "Title",
      meta_description: "",
      canonical_url: null,
      og: {
        "og:title": undefined
      }
    });
    expect(document.title).toEqual("Title — Authors' Haven");
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:title"]')).toBeNull();
  });
});

describe("applyPageSeo", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("applies page-level meta, author, canonical and social cards", () => {
    applyPageSeo({
      title: "About Us",
      description: "About the platform",
      keywords: ["about", "authors"],
      canonicalUrl: "http://localhost:3000/about",
      author: "Patrick Fitz",
      image: "http://localhost:3000/cover.jpg",
      ogType: "profile"
    });

    expect(document.title).toBe("About Us — Authors' Haven");
    expect(document.head.querySelector('meta[name="description"]').getAttribute("content")).toBe("About the platform");
    expect(document.head.querySelector('meta[name="author"]').getAttribute("content")).toBe("Patrick Fitz");
    expect(document.head.querySelector('meta[name="keywords"]').getAttribute("content")).toBe("about, authors");
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute("href")).toBe("http://localhost:3000/about");
    expect(document.head.querySelector('meta[property="og:type"]').getAttribute("content")).toBe("profile");
    expect(document.head.querySelector('meta[property="og:image"]').getAttribute("content")).toBe("http://localhost:3000/cover.jpg");
    expect(document.head.querySelector('meta[name="twitter:card"]').getAttribute("content")).toBe("summary_large_image");
  });

  it("handles empty or partial options gracefully", () => {
    applyPageSeo({});
    expect(document.title).toBe("");
    expect(document.head.querySelector('meta[name="twitter:card"]').getAttribute("content")).toBe("summary");
  });
});
