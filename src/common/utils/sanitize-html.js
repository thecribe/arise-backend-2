import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich-text HTML content.
 *
 * Allows safe formatting while removing scripts,
 * unsafe attributes, and dangerous URLs.
 */
export const sanitizeRichText = (content) => {
  if (typeof content !== "string") {
    return "";
  }

  return sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "ul",
      "ol",
      "li",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
    ],

    allowedAttributes: {
      a: ["href", "target", "rel"],
    },

    allowedSchemes: ["http", "https", "mailto"],

    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
    },

    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  }).trim();
};
