export type RouteId =
  | "home"
  | "method"
  | "results"
  | "videos"
  | "hunyuanvideo"
  | "wan22"
  | "cosmos-predict25"
  | "cosmos3-nano";

export type RouteDefinition = {
  id: RouteId;
  path: string;
  title: string;
  description: string;
  kind: "home" | "method" | "results" | "videos" | "model";
  model?: string;
};

export const siteOrigin = "https://pardistaghavi.github.io/SparsePR-website";
export const repositoryUrl = "https://github.com/PardisTaghavi/SparsePR";

export const routes: RouteDefinition[] = [
  {
    id: "home",
    path: "/",
    title: "SparsePR: Training-Free Sparse Attention for Video Generation",
    description: "SparsePR is training-free sparse attention for video generation and world models, evaluated across HunyuanVideo, Wan2.2, Cosmos-Predict2.5, and Cosmos3-Nano.",
    kind: "home",
  },
  {
    id: "method",
    path: "/method/",
    title: "Response-Coupled Partitioning for Sparse Video Attention | SparsePR",
    description: "Learn how SparsePR combines Response-Coupled Partitioning with Probe-Fitted Residual Reconstruction to build executable sparse attention routes.",
    kind: "method",
  },
  {
    id: "results",
    path: "/results/",
    title: "SparsePR Benchmarks: Density, PSNR, SSIM, and Speedup",
    description: "SparsePR quality and efficiency results across four video and world models, including PSNR, SSIM, executed-pair density, PFLOPs, and end-to-end speedup.",
    kind: "results",
  },
  {
    id: "videos",
    path: "/videos/",
    title: "SparsePR Video Results on Wan2.2, HunyuanVideo, and Cosmos",
    description: "Browse SparsePR sparse-attention video outputs from HunyuanVideo, Wan2.2, Cosmos-Predict2.5, and Cosmos3-Nano with prompts and fidelity metrics.",
    kind: "videos",
  },
  {
    id: "hunyuanvideo",
    path: "/models/hunyuanvideo/",
    title: "SparsePR on HunyuanVideo-13B | Video Results",
    description: "SparsePR results and selected 720p text-to-video outputs for HunyuanVideo-13B at 21.92% executed-pair density and 2.61x end-to-end speedup.",
    kind: "model",
    model: "HunyuanVideo-13B",
  },
  {
    id: "wan22",
    path: "/models/wan22/",
    title: "SparsePR on Wan2.2-I2V-A14B | Video Results",
    description: "SparsePR results and selected image-to-video outputs for Wan2.2-I2V-A14B at 21.97% executed-pair density and 1.80x end-to-end speedup.",
    kind: "model",
    model: "Wan2.2-I2V-A14B",
  },
  {
    id: "cosmos-predict25",
    path: "/models/cosmos-predict25/",
    title: "SparsePR on Cosmos-Predict2.5-14B | World Model Results",
    description: "SparsePR quality, efficiency, and video results for Cosmos-Predict2.5-14B at 22.14% executed-pair density and 1.51x end-to-end speedup.",
    kind: "model",
    model: "Cosmos-Predict2.5-14B",
  },
  {
    id: "cosmos3-nano",
    path: "/models/cosmos3-nano/",
    title: "SparsePR on Cosmos3-Nano-16B | World Model Results",
    description: "SparsePR quality, efficiency, and video results for Cosmos3-Nano-16B at 25.96% executed-pair density and 1.48x end-to-end speedup.",
    kind: "model",
    model: "Cosmos3-Nano-16B",
  },
];

export const routeById = Object.fromEntries(routes.map((route) => [route.id, route])) as Record<RouteId, RouteDefinition>;

export function resolveRoute(pathname: string): RouteDefinition {
  const base = "/SparsePR-website";
  const normalized = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const withSlash = normalized === "/" ? "/" : `${normalized.replace(/\/$/, "")}/`;
  return routes.find((route) => route.path === withSlash) ?? routeById.home;
}

export function canonicalUrl(route: RouteDefinition) {
  return `${siteOrigin}${route.path === "/" ? "/" : route.path}`;
}
