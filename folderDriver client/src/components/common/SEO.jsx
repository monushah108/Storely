import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Helper to update or create a <meta> tag
 */
function updateMetaTag(identifier, content, isProperty = false) {
  if (!content) return;
  const attribute = isProperty ? "property" : "name";
  let element = document.head.querySelector(`meta[${attribute}="${identifier}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, identifier);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

/**
 * Helper to update or create a <link> tag (e.g., canonical)
 */
function updateLinkTag(rel, href) {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

/**
 * Custom hook to update document SEO metadata dynamically
 */
export function useSEO({
  title = "Storely - Secure Cloud Storage & File Sharing",
  description = "Storely gives you a simple, secure place to upload, organize, preview, and share your files and folders with ease.",
  keywords = "cloud storage, file sharing, secure drive, online file manager, Storely",
  canonical,
  ogImage = "/home.png",
  ogType = "website",
  noIndex = false,
  jsonLd,
} = {}) {
  const location = useLocation();

  useEffect(() => {
    const isCurrentPathAdmin = location.pathname.startsWith("/admin");
    const shouldNoIndex = noIndex || isCurrentPathAdmin;

    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Strict Robots Meta Handling:
    // If it's an admin route or marked noIndex, completely disallow indexing and crawling
    if (shouldNoIndex) {
      updateMetaTag("robots", "noindex, nofollow");
      updateMetaTag("googlebot", "noindex, nofollow");
      const jsonLdScript = document.head.querySelector("#dynamic-jsonld-schema");
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
      return;
    }

    // Non-admin routes: enable full indexation
    updateMetaTag("robots", "index, follow");
    updateMetaTag("googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // 3. Meta Description & Keywords
    if (description) {
      updateMetaTag("description", description);
      updateMetaTag("title", title);
    }
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // 4. Canonical URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://storely.app";
    const canonicalUrl = canonical
      ? (canonical.startsWith("http") ? canonical : `${baseUrl}${canonical}`)
      : `${baseUrl}${location.pathname}`;
    updateLinkTag("canonical", canonicalUrl);

    // 5. Open Graph Meta Tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", ogType, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:site_name", "Storely", true);

    const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
    updateMetaTag("og:image", fullImageUrl, true);

    // 6. Twitter Card Meta Tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", fullImageUrl);
    updateMetaTag("twitter:url", canonicalUrl);

    // 7. Dynamic JSON-LD Structured Data
    let jsonLdScript = document.head.querySelector("#dynamic-jsonld-schema");
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = "dynamic-jsonld-schema";
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType,
    noIndex,
    jsonLd,
    location.pathname,
  ]);
}

/**
 * Declarative SEO Component for JSX usage
 */
export default function SEO(props) {
  useSEO(props);
  return null;
}
