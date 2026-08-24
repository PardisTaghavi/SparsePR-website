import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { galleries, render, routes } from "../dist-ssr/entry-server.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = await readFile(join(dist, "index.html"), "utf8");
const origin = "https://pardistaghavi.github.io/SparsePR-website";
const image = `${origin}/og.png`;
const paperTitle = "Partition the Support, Reconstruct the Residual: Training-Free Sparse Attention for Video Generation and World Models";
const paperAuthors = ["Pardis Taghavi", "Reza Langari", "Gaurav Pandey"];
const paperUrl = "https://arxiv.org/abs/2608.18484";
const paperPdfUrl = "https://arxiv.org/pdf/2608.18484";

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const canonical = (route) => `${origin}${route.path}`;

function structuredData(route) {
  const pageUrl = canonical(route);
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "SparsePR",
      description: "Training-free sparse attention for video generation and world models.",
      inLanguage: "en",
    },
    {
      "@type": "ScholarlyArticle",
      "@id": `${origin}/#paper`,
      headline: paperTitle,
      author: paperAuthors.map((name) => ({
        "@type": "Person",
        name,
        affiliation: { "@type": "CollegeOrUniversity", name: "Texas A&M University" },
      })),
      datePublished: "2026-08-19",
      identifier: "arXiv:2608.18484",
      image,
      url: paperUrl,
      sameAs: paperUrl,
      encoding: { "@type": "MediaObject", contentUrl: paperPdfUrl, encodingFormat: "application/pdf" },
      isAccessibleForFree: true,
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${origin}/#code`,
      name: "SparsePR",
      description: "Open-source implementation of training-free sparse attention for video generation and world models.",
      codeRepository: "https://github.com/PardisTaghavi/SparsePR",
      url: "https://github.com/PardisTaghavi/SparsePR",
      author: { "@type": "Person", name: "Pardis Taghavi" },
    },
    {
      "@type": route.kind === "model" || route.kind === "videos" ? "CollectionPage" : "WebPage",
      "@id": `${pageUrl}#page`,
      url: pageUrl,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": `${origin}/#paper` },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      inLanguage: "en",
    },
  ];

  const selectedGalleries = route.kind === "videos"
    ? galleries
    : route.kind === "model"
      ? galleries.filter((gallery) => gallery.model === route.model)
      : [];

  if (selectedGalleries.length > 0) {
    graph[3].video = selectedGalleries.flatMap((gallery) => gallery.clips.slice(0, 3).map((clip) => ({
      "@type": "VideoObject",
      name: `${gallery.model}: ${clip.prompt}`,
      description: `${clip.prompt} ${clip.benchmark} sample; dense-reference fidelity: ${clip.score}.`,
      thumbnailUrl: [`${origin}${clip.src.replace("/media/gallery/", "/media/thumbnails/").replace(/\.mp4$/, ".jpg")}`],
      uploadDate: "2026-08-18",
      contentUrl: `${origin}${clip.src}`,
      isFamilyFriendly: true,
    })));
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

function head(route) {
  const url = canonical(route);
  const citationMetadata = route.path === "/" ? [
    `<meta name="citation_title" content="${escapeAttribute(paperTitle)}" />`,
    ...paperAuthors.map((author) => `<meta name="citation_author" content="${escapeAttribute(author)}" />`),
    '<meta name="citation_publication_date" content="2026/08/19" />',
    '<meta name="citation_arxiv_id" content="2608.18484" />',
    `<meta name="citation_abstract_html_url" content="${paperUrl}" />`,
    `<meta name="citation_pdf_url" content="${paperPdfUrl}" />`,
    `<link rel="alternate" type="application/pdf" href="${paperPdfUrl}" />`,
  ] : [];
  return [
    '<meta name="robots" content="index,follow,max-image-preview:large,max-video-preview:-1,max-snippet:-1" />',
    ...citationMetadata,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapeAttribute(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(route.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${structuredData(route)}</script>`,
  ].join("\n    ");
}

for (const route of routes) {
  const html = template
    .replaceAll("__TITLE__", escapeAttribute(route.title))
    .replaceAll("__DESCRIPTION__", escapeAttribute(route.description))
    .replace("<!--app-head-->", head(route))
    .replace("<!--app-html-->", render(route));
  const output = route.path === "/" ? join(dist, "index.html") : join(dist, route.path, "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

await rm(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`Prerendered ${routes.length} indexable routes.`);
