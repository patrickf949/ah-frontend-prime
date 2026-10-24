const setMetaTag = (attribute, key, content) => {
  if (!content) {
    return;
  }
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setCanonical = url => {
  if (!url) {
    return;
  }
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
};

/**
 * Apply general page SEO metadata to document head.
 */
export const applyPageSeo = ({
  title,
  rawTitle,
  description,
  keywords = [],
  canonicalUrl,
  author,
  ogType = "website",
  image
}) => {
  if (rawTitle) {
    document.title = rawTitle;
    setMetaTag("property", "og:title", rawTitle);
    setMetaTag("name", "twitter:title", rawTitle);
  } else if (title) {
    document.title = `${title} — Authors' Haven`;
    setMetaTag("property", "og:title", title);
    setMetaTag("name", "twitter:title", title);
  }
  if (description) {
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:description", description);
    setMetaTag("name", "twitter:description", description);
  }
  if (author) {
    setMetaTag("name", "author", author);
  }
  if (keywords && keywords.length) {
    setMetaTag("name", "keywords", keywords.join(", "));
  }
  if (canonicalUrl) {
    setCanonical(canonicalUrl);
    setMetaTag("property", "og:url", canonicalUrl);
  }
  if (ogType) {
    setMetaTag("property", "og:type", ogType);
  }
  if (image) {
    setMetaTag("property", "og:image", image);
    setMetaTag("name", "twitter:image", image);
  }
  setMetaTag("name", "twitter:card", image ? "summary_large_image" : "summary");
};

/**
 * Apply an article's SEO payload (from the API `seo` field) to the
 * document head: title, description, keywords, canonical URL and
 * Open Graph / Twitter card tags.
 */
export const applyArticleSeo = seo => {
  if (!seo) {
    return;
  }
  if (seo.meta_title) {
    document.title = `${seo.meta_title} — Authors' Haven`;
  }
  setMetaTag("name", "description", seo.meta_description);
  if (seo.keywords && seo.keywords.length) {
    setMetaTag("name", "keywords", seo.keywords.join(", "));
  }
  setCanonical(seo.canonical_url);
  Object.entries(seo.og || {}).forEach(([property, content]) => {
    if (!Array.isArray(content)) {
      setMetaTag("property", property, content);
    }
  });
  Object.entries(seo.twitter || {}).forEach(([name, content]) => {
    setMetaTag("name", name, content);
  });
};
