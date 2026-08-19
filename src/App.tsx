"use client";

import { useEffect, useRef, useState } from "react";
import { repositoryUrl, routeById, type RouteDefinition } from "./routes";

const assetBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const assetUrl = (path: string) => `${assetBase}${path}`;
const pageUrl = (path: string) => `${assetBase}${path}`;

type GalleryClip = {
  src: string;
  prompt: string;
  benchmark: "VBench" | "PBench";
  score: string;
};

const galleries: { model: string; task: string; selection: string; clips: GalleryClip[] }[] = [
  {
    model: "HunyuanVideo-13B",
    task: "Text-to-video · 720p",
    selection: "12 quality-selected VBench samples",
    clips: [
      { src: "/media/gallery/hunyuan/0025_hunyuan_t2v_025_3bc182d35d.mp4", benchmark: "VBench", score: "33.99 dB", prompt: "Deep in the dense forest, a lighthouse stands alone, its light at the top flickering on and off. The entire video presents a suspenseful atmosphere." },
      { src: "/media/gallery/hunyuan/0000_hunyuan_t2v_000_2a822491e2.mp4", benchmark: "VBench", score: "33.70 dB", prompt: "Two dolphins are swimming in the blue sea." },
      { src: "/media/gallery/hunyuan/0020_hunyuan_t2v_020_d45099d39c.mp4", benchmark: "VBench", score: "32.91 dB", prompt: "In the laboratory, Thomas Edison is using a pen to record his experimental data." },
      { src: "/media/gallery/hunyuan/0006_hunyuan_t2v_006_5cceda79c5.mp4", benchmark: "VBench", score: "32.51 dB", prompt: "A computer is placed on the computer desk, playing a movie. Under the computer desk, there is a black dog lying down, gnawing on a bone. The video is in black and white style." },
      { src: "/media/gallery/hunyuan/0005_hunyuan_t2v_005_b63e7242ad.mp4", benchmark: "VBench", score: "32.45 dB", prompt: "A man in a gray suit stands on the balcony drinking. At his feet lies a black puppy, depicted in 3D cartoon style." },
      { src: "/media/gallery/hunyuan/0013_hunyuan_t2v_013_0a0559c2df.mp4", benchmark: "VBench", score: "31.99 dB", prompt: "An elderly grandmother with white hair and a slightly hunched back walks slowly on the street." },
      { src: "/media/gallery/hunyuan/0007_hunyuan_t2v_007_5494c7ca81.mp4", benchmark: "VBench", score: "31.18 dB", prompt: "After jumping on the sofa, the kitten lies down quietly on the sofa. The desk lamp beside it emits yellow light." },
      { src: "/media/gallery/hunyuan/0023_hunyuan_t2v_023_84856124c1.mp4", benchmark: "VBench", score: "30.43 dB", prompt: "The Golden Gate Bridge glows with a warm halo in the sunset's afterglow, standing majestically against the sea breeze with ships slowly passing beneath. The camera moves vertically from top to bottom during filming." },
      { src: "/media/gallery/hunyuan/0003_hunyuan_t2v_003_33b720221f.mp4", benchmark: "VBench", score: "30.29 dB", prompt: "A small quail forages in the field, looking left and right cautiously." },
      { src: "/media/gallery/hunyuan/0018_hunyuan_t2v_018_100033d555.mp4", benchmark: "VBench", score: "29.39 dB", prompt: "In the garden early in the morning, two elderly people are practicing Tai Chi. Eye level shot." },
      { src: "/media/gallery/hunyuan/0028_hunyuan_t2v_028_3e7bd07d04.mp4", benchmark: "VBench", score: "28.68 dB", prompt: "In the chemistry laboratory, various reagent bottles are neatly arranged on the shelves along the wall, and test tubes and beakers are placed on the central long table. The liquid in a beaker is gently boiling, emitting wisps of steam." },
      { src: "/media/gallery/hunyuan/0019_hunyuan_t2v_019_a6e6f94d7c.mp4", benchmark: "VBench", score: "26.28 dB", prompt: "A little boy is doing his homework." },
    ],
  },
  {
    model: "Wan2.2-I2V-A14B",
    task: "Image-to-video · native aspect ratio",
    selection: "10 selected VBench samples",
    clips: [
      { src: "/media/gallery/wan22/0000_wan22_i2v_000_a_blue_and_white_smoke_is_swirly_in_the_dark.mp4", benchmark: "VBench", score: "28.73 dB", prompt: "A blue and white smoke is swirly in the dark." },
      { src: "/media/gallery/wan22/0001_wan22_i2v_001_an_aerial_view_of_a_small_town_on_the_edge_of_the_ocean.mp4", benchmark: "VBench", score: "27.28 dB", prompt: "An aerial view of a small town on the edge of the ocean." },
      { src: "/media/gallery/wan22/0002_wan22_i2v_002_Colorful_buildings_on_the_seaside_cliffs.mp4", benchmark: "VBench", score: "28.89 dB", prompt: "Colorful buildings on the seaside cliffs." },
      { src: "/media/gallery/wan22/0005_wan22_i2v_005_a_house_with_snow_on_the_ground.mp4", benchmark: "VBench", score: "26.45 dB", prompt: "A house with snow on the ground." },
      { src: "/media/gallery/wan22/0007_wan22_i2v_007_a_dark_alleyway_with_a_bus_driving_down_it.mp4", benchmark: "VBench", score: "30.94 dB", prompt: "A dark alleyway with a bus driving down it." },
      { src: "/media/gallery/wan22/0010_wan22_i2v_010_an_outdoor_dining_area_surrounded_by_plants_and_a_brick_walkway.mp4", benchmark: "VBench", score: "27.39 dB", prompt: "An outdoor dining area surrounded by plants and a brick walkway." },
      { src: "/media/gallery/wan22/0014_wan22_i2v_014_a_large_wave_crashes_into_a_lighthouse_on_a_stormy_day.mp4", benchmark: "VBench", score: "31.38 dB", prompt: "A large wave crashes into a lighthouse on a stormy day." },
      { src: "/media/gallery/wan22/0028_wan22_i2v_028_a_steam_train_traveling_through_the_woods.mp4", benchmark: "VBench", score: "—", prompt: "A steam train traveling through the woods." },
      { src: "/media/gallery/wan22/0034_wan22_i2v_034_a_pink_lotus_flower_in_the_middle_of_a_pond.mp4", benchmark: "VBench", score: "—", prompt: "A pink lotus flower in the middle of a pond." },
      { src: "/media/gallery/wan22/0042_wan22_i2v_042_two_men_riding_bikes_down_a_road_near_a_forest.mp4", benchmark: "VBench", score: "—", prompt: "Two men riding bikes down a road near a forest." },
    ],
  },
  {
    model: "Cosmos-Predict2.5-14B",
    task: "Image-to-world · native 720p class",
    selection: "6 VBench + 4 PBench",
    clips: [
      { src: "/media/gallery/cosmos25/0000_a_view_of_a_star_trail_in_the_night_sky.mp4", benchmark: "VBench", score: "40.33 dB", prompt: "A view of a star trail in the night sky." },
      { src: "/media/gallery/cosmos25/0012_an_aerial_view_of_a_rocky_beach_in_indonesia.mp4", benchmark: "VBench", score: "26.19 dB", prompt: "An aerial view of a rocky beach in Indonesia." },
      { src: "/media/gallery/cosmos25/0019_a_butterfly_sits_on_top_of_a_purple_flower.mp4", benchmark: "VBench", score: "19.82 dB", prompt: "A butterfly sits on top of a purple flower." },
      { src: "/media/gallery/cosmos25/0020_a_yellow_and_white_jellyfish_is_floating_in_the_ocean.mp4", benchmark: "VBench", score: "22.06 dB", prompt: "A yellow and white jellyfish is floating in the ocean." },
      { src: "/media/gallery/cosmos25/0021_a_clown_fish_hiding_in_a_purple_anemone.mp4", benchmark: "VBench", score: "selected", prompt: "A clown fish hiding in a purple anemone." },
      { src: "/media/gallery/cosmos25/0022_a_small_bird_sits_on_a_moss_covered_branch.mp4", benchmark: "VBench", score: "selected", prompt: "A small bird sits on a moss-covered branch." },
      { src: "/media/gallery/cosmos25/0002_common_sense_2e166ef8-062f-4b00-8fd3-e3276edc3367.mp4", benchmark: "PBench", score: "top-4", prompt: "A serene pastoral scene under a dramatic sky, with five cows grazing in a lush green field beneath a mountain range." },
      { src: "/media/gallery/cosmos25/0009_human_122.mp4", benchmark: "PBench", score: "top-4", prompt: "Four children in brightly colored raincoats hold hands, smile, and jump together in heavy rain." },
      { src: "/media/gallery/cosmos25/0012_common_sense_582541ff-6b89-499a-9ccc-a1eb7995adb8.mp4", benchmark: "PBench", score: "top-4", prompt: "A sleek black SUV drives down a sunlit dirt road, turns left, and subtly kicks up dust." },
      { src: "/media/gallery/cosmos25/0014_human_269.mp4", benchmark: "PBench", score: "top-4", prompt: "An aerial view of a swimmer moving gracefully across a turquoise tiled pool." },
    ],
  },
  {
    model: "Cosmos3-Nano-16B",
    task: "Image-to-world · 720p",
    selection: "6 VBench + 1 PBench sample",
    clips: [
      { src: "/media/gallery/cosmos3/0117_a_highland_cow_with_long_horns_standing_in_a_field.mp4", benchmark: "VBench", score: "26.07 dB", prompt: "A highland cow with long horns standing in a field." },
      { src: "/media/gallery/cosmos3/0138_a_giraffe_walking_in_a_field.mp4", benchmark: "VBench", score: "22.92 dB", prompt: "A giraffe walking in a field." },
      { src: "/media/gallery/cosmos3/0141_a_warthog_is_walking_in_the_grass.mp4", benchmark: "VBench", score: "21.41 dB", prompt: "A warthog is walking in the grass." },
      { src: "/media/gallery/cosmos3/0163_a_red_and_white_tram_traveling_down_a_snowy_street.mp4", benchmark: "VBench", score: "18.46 dB", prompt: "A red and white tram traveling down a snowy street." },
      { src: "/media/gallery/cosmos3/0208_a_yellow_water_lily_is_floating_in_a_pond.mp4", benchmark: "VBench", score: "25.68 dB", prompt: "A yellow water lily is floating in a pond." },
      { src: "/media/gallery/cosmos3/0237_a_man_on_a_surfboard_riding_a_wave_in_the_ocean_from_2.2s.mp4", benchmark: "VBench", score: "22.26 dB", prompt: "A man on a surfboard riding a wave in the ocean." },
      { src: "/media/gallery/cosmos3/0318_robot_096_first_2s.mp4", benchmark: "PBench", score: "24.08 dB", prompt: "The video begins with a panning shot of a wooden tray being moved away from a desk in an office setting. On the tray, there is a dark-colored cup. The robot's arms rotate right, causing the camera to pan right while the tray remains centered in the frame." },
    ],
  },
];

const modelResults: Record<string, { density: string; speedup: string; psnr: string; ssim: string; pbench?: string; summary: string }> = {
  "HunyuanVideo-13B": {
    density: "21.92%",
    speedup: "2.61×",
    psnr: "31.844",
    ssim: "0.932",
    summary: "SparsePR accelerates 720p text-to-video generation while preserving dense-reference fidelity on HunyuanVideo-13B.",
  },
  "Wan2.2-I2V-A14B": {
    density: "21.97%",
    speedup: "1.80×",
    psnr: "30.658",
    ssim: "0.907",
    summary: "SparsePR applies executable sparse attention to Wan2.2 image-to-video generation with matched dense-reference evaluation.",
  },
  "Cosmos-Predict2.5-14B": {
    density: "22.14%",
    speedup: "1.51×",
    psnr: "26.328",
    ssim: "0.942",
    pbench: "77.75",
    summary: "SparsePR preserves physical-world prediction quality while reducing executed attention pairs on Cosmos-Predict2.5-14B.",
  },
  "Cosmos3-Nano-16B": {
    density: "25.96%",
    speedup: "1.48×",
    psnr: "24.417",
    ssim: "0.801",
    pbench: "77.30",
    summary: "SparsePR provides training-free sparse attention for Cosmos3-Nano-16B image-to-world generation.",
  },
};

type ResultRow = {
  cells: string[];
  groupStart?: boolean;
  highlight?: boolean;
};

const qualityResults: ResultRow[] = [
  { cells: ["HunyuanVideo-13B", "Dense", "–", "–", "–", "0.850", "0.976", "–", "100%", "612.38", "1.00×"], groupStart: true },
  { cells: ["HunyuanVideo-13B", "SpargeAttn†", "24.589", "0.796", "0.232", "–", "0.908", "–", "40.09%", "389.76", "1.38×"] },
  { cells: ["HunyuanVideo-13B", "SVG2†", "30.452", "0.910", "0.117", "0.852", "0.927", "–", "25.45%", "299.02", "2.30×"] },
  { cells: ["HunyuanVideo-13B", "SVOO†", "24.879", "0.843", "0.224", "0.6793", "0.9799", "–", "–", "–", "2.17×"] },
  { cells: ["HunyuanVideo-13B", "SVG-EAR†", "31.043", "0.928", "0.092", "0.845", "0.903", "–", "22.17%", "281.86", "1.93×"] },
  { cells: ["HunyuanVideo-13B", "SparsePR", "31.844", "0.932", "0.087", "0.850", "0.976", "–", "21.92%", "255.95", "2.61×"], highlight: true },
  { cells: ["Wan2.2-I2V-A14B", "Dense", "–", "–", "–", "0.689", "0.974", "–", "100%", "658.46", "1.00×"], groupStart: true },
  { cells: ["Wan2.2-I2V-A14B", "SpargeAttn†", "27.140", "0.883", "0.116", "0.680", "0.958", "–", "30.15%", "396.83", "1.58×"] },
  { cells: ["Wan2.2-I2V-A14B", "SVG2†", "26.562", "0.861", "0.138", "0.668", "0.959", "–", "31.28%", "393.95", "1.59×"] },
  { cells: ["Wan2.2-I2V-A14B", "SVOO†", "29.678", "0.913", "0.095", "0.7337", "0.9731", "–", "–", "–", "1.61×"] },
  { cells: ["Wan2.2-I2V-A14B", "SVG-EAR†", "29.759", "0.918", "0.093", "0.680", "0.959", "–", "23.64%", "378.88", "1.61×"] },
  { cells: ["Wan2.2-I2V-A14B", "SparsePR", "30.658", "0.907", "0.044", "0.687", "0.973", "–", "21.97%", "328.70", "1.80×"], highlight: true },
  { cells: ["Cosmos-Predict2.5-14B", "Dense", "–", "–", "–", "0.714", "0.976", "77.76", "100%", "526.87", "1.00×"], groupStart: true },
  { cells: ["Cosmos-Predict2.5-14B", "SVG2", "20.075", "0.624", "0.330", "0.678", "0.896", "76.14", "28.81%", "286.51", "1.24×"] },
  { cells: ["Cosmos-Predict2.5-14B", "SVOO", "22.066", "0.685", "0.289", "0.701", "0.909", "76.03", "37.63%", "315.38", "1.03×"] },
  { cells: ["Cosmos-Predict2.5-14B", "SVG-EAR", "25.549", "0.908", "0.062", "0.710", "0.976", "77.78", "29.75%", "289.69", "1.10×"] },
  { cells: ["Cosmos-Predict2.5-14B", "SparsePR", "26.328", "0.942", "0.068", "0.714", "0.976", "77.75", "22.14%", "253.61", "1.51×"], highlight: true },
  { cells: ["Cosmos3-Nano-16B", "Dense", "–", "–", "–", "0.700", "0.950", "77.31", "100.00%", "90.01", "1.00×"], groupStart: true },
  { cells: ["Cosmos3-Nano-16B", "SVG2", "22.458", "0.735", "0.216", "0.677", "0.915", "75.03", "37.29%", "57.69", "1.16×"] },
  { cells: ["Cosmos3-Nano-16B", "SVOO", "16.642", "0.573", "0.381", "0.707", "0.962", "77.59", "67.32%", "69.51", "1.02×"] },
  { cells: ["Cosmos3-Nano-16B", "SVG-EAR", "21.167", "0.709", "0.261", "0.658", "0.872", "72.85", "37.18%", "57.64", "1.10×"] },
  { cells: ["Cosmos3-Nano-16B", "SparsePR", "24.417", "0.801", "0.176", "0.699", "0.949", "77.30", "25.96%", "43.22", "1.48×"], highlight: true },
];

const partitionResults: ResultRow[] = [
  { cells: ["Semantic partition", "0.0887 / 0.7136", "0.1634 / 1.7338", "0.7903 / 7.5318", "0.3590 / 3.3557"] },
  { cells: ["Key-response K/V partition", "0.0851 / 0.8121", "0.1560 / 1.6591", "0.7686 / 7.2700", "0.3409 / 3.1738"] },
  { cells: ["Response-coupled partition", "0.0736 / 0.6967", "0.1489 / 1.6479", "0.7617 / 7.2271", "0.3315 / 3.1502"] },
  { cells: ["Semantic + probe repair", "0.0527 / 0.3562", "0.1041 / 0.8186", "0.2622 / 0.8260", "0.1720 / 0.8648"] },
  { cells: ["SparsePR", "0.0330 / 0.2285", "0.0707 / 0.4305", "0.0954 / 0.5769", "0.0822 / 0.4951"], highlight: true },
];

const querySupports = [
  [3, 18, 37],
  [3, 11, 37],
  [11, 18, 44],
  [3, 25, 44],
  [18, 31, 37],
  [11, 25, 42],
  [3, 31, 46],
  [11, 29, 47],
];

const bibtex = `@article{sparsepr2026,
  title   = {Partition the Support, Reconstruct the Residual:
             Training-Free Sparse Attention for Video Generation and World Models},
  author  = {Taghavi, Pardis and Langari, Reza and Pandey, Gaurav},
  journal = {arXiv preprint},
  year    = {2026}
}`;

function GalleryVideo({ clip }: { clip: GalleryClip }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void node.play().catch(() => undefined);
      else node.pause();
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [clip.src]);

  return (
    <article className="gallery-video" tabIndex={0} aria-label={`${clip.benchmark} video. Hover or focus to read the prompt.`}>
      <video ref={video} muted loop playsInline preload="metadata">
        <source src={assetUrl(clip.src)} type="video/mp4" />
      </video>
      <div className="prompt-overlay">
        <span>Prompt</span>
        <p>{clip.prompt}</p>
      </div>
      <div className="clip-meta">
        <span>{clip.benchmark}</span>
        <strong>{clip.score}</strong>
      </div>
    </article>
  );
}

function ModelGallery({ gallery }: { gallery: (typeof galleries)[number] }) {
  const [start, setStart] = useState(0);
  const visible = [0, 1, 2].map((offset) => gallery.clips[(start + offset) % gallery.clips.length]);
  const move = (direction: number) => setStart((current) => (current + direction + gallery.clips.length) % gallery.clips.length);

  return (
    <section className="model-gallery" aria-label={`${gallery.model} qualitative video gallery`}>
      <div className="gallery-heading">
        <div><h3>{gallery.model}</h3><p>{gallery.task}</p></div>
        <span>{gallery.selection} · metric-selected</span>
      </div>
      <div className="gallery-stage">
        <button className="gallery-arrow previous" onClick={() => move(-1)} aria-label={`Previous ${gallery.model} videos`}>←</button>
        <div className="gallery-grid" key={`${gallery.model}-${start}`}>
          {visible.map((clip, index) => <GalleryVideo key={`${clip.src}-${index}`} clip={clip} />)}
        </div>
        <button className="gallery-arrow next" onClick={() => move(1)} aria-label={`Next ${gallery.model} videos`}>→</button>
      </div>
      <div className="gallery-position" aria-live="polite">{String(start + 1).padStart(2, "0")} / {String(gallery.clips.length).padStart(2, "0")}</div>
    </section>
  );
}

function SupportRow({ label, active, union = false }: { label: string; active: number[]; union?: boolean }) {
  const support = new Set(active);
  return (
    <div className={`support-row${union ? " union" : ""}`} aria-label={`${label}: ${active.length} highlighted K/V blocks`}>
      <span>{label}</span>
      <div className="support-blocks" aria-hidden="true">
        {Array.from({ length: 48 }).map((_, index) => <i key={index} className={support.has(index) ? "active" : ""} />)}
      </div>
    </div>
  );
}

function ResultTable({ headers, rows, wide = false }: { headers: string[]; rows: ResultRow[]; wide?: boolean }) {
  return (
    <div className="results-table-wrap">
      <table className={`results-data-table${wide ? " wide" : ""}`}>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.cells[0]}-${rowIndex}`} className={`${row.groupStart ? "group-start " : ""}${row.highlight ? "highlight" : ""}`.trim()}>
              {row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === 0 || (wide && cellIndex === 1) ? <strong>{cell}</strong> : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SiteNav() {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href={pageUrl("/")}><span className="brand-mark">S</span> SparsePR</a>
      <div className="navlinks">
        <a href={pageUrl("/videos/")}>Videos</a>
        <a href={pageUrl("/method/")}>Method</a>
        <a href={pageUrl("/results/")}>Results</a>
        <a href={`${pageUrl("/")}#citation`}>Citation</a>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="content footer">
      <div><strong>SparsePR</strong><span>Partition the support. Reconstruct the residual.</span></div>
      <p><a href={pageUrl("/method/")}>Method</a> · <a href={pageUrl("/results/")}>Results</a> · <a href={pageUrl("/videos/")}>Videos</a> · <a href={repositoryUrl}>Code</a><br />Website structure adapted from <a href="https://nerfies.github.io/">Nerfies</a> under CC BY-SA 4.0. © 2026 Pardis Taghavi, Reza Langari, and Gaurav Pandey.</p>
    </footer>
  );
}

function HomePage() {
  const [groupSize, setGroupSize] = useState(8);
  const [copied, setCopied] = useState(false);
  const visibleSupports = querySupports.slice(0, groupSize);
  const sharedRoute = Array.from(new Set(visibleSupports.flat())).sort((a, b) => a - b);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main>
      <SiteNav />

      <header id="top" className="hero content">
        <div className="eyebrow">Training-free sparse attention</div>
        <h1><span>SparsePR</span></h1>
        <p className="hero-kicker">Partition the Support. Reconstruct the Residual.</p>
        <h2>Training-Free Sparse Attention for<br className="desktop-break" /> Video Generation and World Models</h2>
        <p className="authors">Pardis Taghavi · Reza Langari · Gaurav Pandey</p>
        <p className="affiliation">Texas A&amp;M University</p>
        <div className="hero-actions">
          <span className="button primary disabled" aria-disabled="true">Paper <small>soon</small></span>
          <a className="button" href={repositoryUrl}>Code ↗</a>
          <a className="button" href={pageUrl("/results/")}>Results →</a>
          <a className="button" href="#citation">BibTeX</a>
        </div>
        <div className="tldr"><strong>TL;DR</strong><span>SparsePR couples executable response-aware partitions with a small set of exact probe rows to recover the residual that sparse attention leaves behind.</span></div>
      </header>

      <section className="gallery-section" id="videos" aria-labelledby="teaser-heading">
        <div className="section-intro compact">
          <p className="section-number">01 / See the result</p>
          <h2 id="teaser-heading">SparsePR across four video models.</h2>
        </div>
        <div className="model-galleries">{galleries.map((gallery) => <ModelGallery key={gallery.model} gallery={gallery} />)}</div>
      </section>

      <section className="metrics-band" aria-label="Headline results">
        <div><strong>21.9–26.0%</strong><span>executed-pair density</span></div>
        <div><strong>1.48–2.61×</strong><span>end-to-end speedup</span></div>
        <div><strong>4</strong><span>models</span></div>
        <div><strong>0</strong><span>training steps</span></div>
      </section>

      <section className="content prose-section" id="abstract">
        <p className="section-number">02 / Abstract</p>
        <h2>Executable sparsity needs more than concentrated attention.</h2>
        <div className="abstract-grid">
          <p>Training-free block-sparse attention can accelerate video transformers, but attention concentration alone does not define an executable sparse operator. Shared query routes can expand support, and retained attention mass does not predict the output error from skipped interactions.</p>
          <p><strong>SparsePR</strong> combines Response-Coupled Partitioning with Probe-Fitted Residual Reconstruction. It groups queries and paired K/V tokens by current-call responses, then uses a small set of exact query rows to correct the sparse output. Across four models, SparsePR preserves quality at 22% to 26% executed-pair density with 1.48× to 2.61× end-to-end speedups.</p>
        </div>
      </section>

      <section className="wide-section insight-section" id="method">
        <div className="section-intro">
          <p className="section-number">03 / Why partition geometry matters</p>
          <h2>Why per-query sparsity is not executable sparsity.</h2>
          <p><strong>Support density</strong> is the percentage of key tokens needed to retain 90% of attention mass. The pooled diagnostic measures their union across queries before block routing.</p>
        </div>
        <div className="support-lab">
          <div className="support-control">
            <label htmlFor="group-size"><span>Queries sharing one executable route</span><strong>{groupSize}</strong></label>
            <input id="group-size" type="range" min="1" max="8" step="1" value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} />
            <div className="range-endpoints"><span>1 query · 6.2%</span><span>8 queries · 22.9%</span></div>
          </div>
          <div className="support-comparison">
            <article className="support-panel single-panel">
              <div className="support-panel-heading"><div><span>Single query</span><h3>Per-query support</h3></div><strong>6.2%</strong></div>
              <p>One query needs a small key support.</p>
              <div className="support-rows"><SupportRow label="Q1" active={querySupports[0]} /></div>
            </article>
            <article className="support-panel pooled-panel">
              <div className="support-panel-heading"><div><span>Shared route</span><h3>{groupSize} {groupSize === 1 ? "query" : "queries"} pooled</h3></div><strong>{groupSize === 8 ? "22.9%" : groupSize === 1 ? "6.2%" : "Union"}</strong></div>
              <p>Each query is sparse; a shared route must cover their union.</p>
              <div className="support-rows">
                {visibleSupports.map((support, index) => <SupportRow key={index} label={`Q${index + 1}`} active={support} />)}
                <SupportRow label="Route" active={sharedRoute} union />
              </div>
            </article>
          </div>
          <div className="support-legend"><span><i />Omitted key support</span><span><i className="active" />Retained key support</span><span><i className="union" />Pooled support</span></div>
          <aside className="method-callout"><strong>SparsePR</strong><p>groups queries with similar response patterns, increasing support overlap before constructing the shared route.</p></aside>
        </div>
        <figure className="paper-figure structural-figure"><img src={assetUrl("/media/figures/structural-observations-final.png")} alt="Per-query sparsity versus pooled support density and normalized output error versus retained attention mass across four models" /><figcaption>Per-query concentration does not determine pooled support, and retained attention mass does not determine output error.</figcaption></figure>
      </section>

      <section className="method-section">
        <div className="content">
          <p className="section-number light">04 / Method</p>
          <h2>One response geometry.<br />Two coupled stages.</h2>
          <p className="method-lead">SparsePR constructs the executable partition and reconstructs its error using features from the same current attention call.</p>
          <div className="pipeline" aria-label="SparsePR method pipeline">
            <div className="pipe-card"><span>01</span><strong>Sample responses</strong><p>Probe a compact subset of queries against K/V.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card accent"><span>02</span><strong>Partition support</strong><p>Form paired K/V groups, then response-aligned query groups.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card"><span>03</span><strong>Execute sparse routes</strong><p>Select and evaluate hardware-ready query–K/V cells.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card accent2"><span>04</span><strong>Reconstruct residual</strong><p>Fit a call-specific correction from exact probe rows.</p></div>
          </div>
          <div className="method-columns">
            <article><span className="method-tag">RCP</span><h3>Response-Coupled Partitioning</h3><p>Sampled query responses define value-aware paired K/V groups. Their centroids become query-response coordinates, aligning queries that can efficiently share one route.</p></article>
            <article><span className="method-tag">PFRR</span><h3>Probe-Fitted Residual Reconstruction</h3><p>A small stratified set of query rows is evaluated exactly. Their observed post-softmax residuals fit an affine correction in a low-rank probe-residual subspace.</p></article>
          </div>
        </div>
      </section>

      <section className="wide-section results-section" id="results">
        <div className="section-intro">
          <p className="section-number">05 / Results</p>
          <h2>Quality and efficiency across four video models.</h2>
          <p>All quantitative results from the final draft. Values use matched hardware and sequence shapes where reproduced. Density includes routing and exact probe pairs.</p>
        </div>
        <article className="results-block">
          <div className="results-subhead"><p>Table 1</p><div><h3>Quality and efficiency</h3><span>Reference fidelity, task quality, executed-pair density, attention PFLOPs, and end-to-end speedup.</span></div></div>
          <ResultTable wide headers={["Model", "Method", "PSNR ↑", "SSIM ↑", "LPIPS ↓", "ImgQual ↑", "SubCons ↑", "PBench ↑", "Density ↓", "PFLOPs ↓", "E2E ↑"]} rows={qualityResults} />
          <p className="table-note">† Reported by prior work. Rows without † are reproduced under matched hardware, sequence shape, and timing protocols.</p>
        </article>

        <figure className="paper-figure results-figure"><img src={assetUrl("/media/figures/results-final-pdf.png")} alt="Error reduction from response-coupled partitioning across four models and Wan2.2 full-generation latency breakdown" /><figcaption>Response-coupled partitioning reduces mean and p99 error at 22% density. On Wan2.2, SparsePR reaches 1.80× speedup and probe repair uses 1.1% of total latency.</figcaption></figure>

        <article className="results-block">
          <div className="results-subhead"><p>Table 2</p><div><h3>Partitioning and reconstruction ablations</h3><span>Mean / p99 normalized attention-output error at 22% total executed-pair density. Lower is better.</span></div></div>
          <ResultTable headers={["Configuration", "HunyuanVideo", "Wan2.2", "Cosmos-Predict2.5", "Cosmos3-Nano"]} rows={partitionResults} />
        </article>

      </section>

      <section className="citation-section" id="citation">
        <div className="content citation-grid">
          <div><p className="section-number light">06 / Citation</p><h2>Build on SparsePR.</h2></div>
          <div className="bibtex"><button onClick={copyCitation}>{copied ? "Copied" : "Copy BibTeX"}</button><pre>{bibtex}</pre></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="content page-hero">
      <p className="section-number">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{lead}</p>
    </header>
  );
}

function MethodPage() {
  return (
    <main>
      <SiteNav />
      <PageHero eyebrow="SparsePR method" title="Executable sparsity from response geometry." lead="SparsePR builds hardware-ready sparse routes and repairs their output error using information from the same attention call." />
      <section className="method-section standalone-method">
        <div className="content">
          <h2>One response geometry.<br />Two coupled stages.</h2>
          <div className="pipeline" aria-label="SparsePR method pipeline">
            <div className="pipe-card"><span>01</span><strong>Sample responses</strong><p>Evaluate a compact set of query rows exactly against K/V.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card accent"><span>02</span><strong>Partition support</strong><p>Form paired K/V groups and response-aligned query groups.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card"><span>03</span><strong>Execute sparse routes</strong><p>Select and evaluate hardware-ready query-to-K/V cells.</p></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-card accent2"><span>04</span><strong>Reconstruct residual</strong><p>Fit a call-specific correction from the exact probe rows.</p></div>
          </div>
          <div className="method-columns">
            <article><span className="method-tag">RCP</span><h3>Response-Coupled Partitioning</h3><p>Sampled query responses define value-aware paired K/V groups. Their centroids provide response coordinates for aligning queries that can efficiently share an executable route.</p></article>
            <article><span className="method-tag">PFRR</span><h3>Probe-Fitted Residual Reconstruction</h3><p>A stratified set of exact query rows exposes the post-softmax residual. SparsePR fits an affine correction in a low-rank probe-residual subspace without updating model parameters.</p></article>
          </div>
        </div>
      </section>
      <section className="wide-section standalone-figure">
        <div className="section-intro"><h2>Why per-query sparsity is not executable sparsity.</h2><p>Queries that share one route must use the union of their K/V supports. SparsePR groups queries by response similarity to increase support overlap before routing.</p></div>
        <figure className="paper-figure structural-figure"><img src={assetUrl("/media/figures/structural-observations-final.png")} alt="Per-query attention support density compared with pooled support density and retained attention mass compared with output error" /><figcaption>Per-query concentration does not determine pooled executable support, and retained attention mass does not determine output error.</figcaption></figure>
      </section>
      <SiteFooter />
    </main>
  );
}

function ResultsPage() {
  return (
    <main>
      <SiteNav />
      <PageHero eyebrow="SparsePR results" title="Quality and efficiency across four models." lead="SparsePR is evaluated on text-to-video, image-to-video, and physical-world prediction models. Density includes routing and all exact probe pairs." />
      <section className="wide-section results-section standalone-results">
        <article className="results-block first-block">
          <div className="results-subhead"><p>Table 1</p><div><h2>Quality and efficiency</h2><span>Reference fidelity, task quality, executed-pair density, attention PFLOPs, and end-to-end speedup.</span></div></div>
          <ResultTable wide headers={["Model", "Method", "PSNR ↑", "SSIM ↑", "LPIPS ↓", "ImgQual ↑", "SubCons ↑", "PBench ↑", "Density ↓", "PFLOPs ↓", "E2E ↑"]} rows={qualityResults} />
          <p className="table-note">† Reported by prior work. Rows without † are reproduced under matched hardware, sequence shape, and timing protocols.</p>
        </article>
        <figure className="paper-figure results-figure"><img src={assetUrl("/media/figures/results-final-pdf.png")} alt="Error reduction from response-coupled partitioning and full-generation latency breakdown" /><figcaption>At matched density, response-coupled partitioning reduces mean and p99 error. SparsePR reaches 1.80× end-to-end speedup on Wan2.2, with probe repair using 1.1% of total latency.</figcaption></figure>
        <article className="results-block">
          <div className="results-subhead"><p>Table 2</p><div><h2>Partitioning and reconstruction ablations</h2><span>Mean and p99 normalized attention-output error at 22% total executed-pair density. Lower is better.</span></div></div>
          <ResultTable headers={["Configuration", "HunyuanVideo", "Wan2.2", "Cosmos-Predict2.5", "Cosmos3-Nano"]} rows={partitionResults} />
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}

function VideosPage() {
  return (
    <main>
      <SiteNav />
      <PageHero eyebrow="Qualitative results" title="SparsePR video gallery." lead="Browse sparse-attention outputs from four heterogeneous video and world models. Hover or focus a video to read its generation prompt." />
      <section className="gallery-section standalone-gallery">
        <div className="model-index" aria-label="Model result pages">
          <a href={pageUrl("/models/hunyuanvideo/")}>HunyuanVideo</a>
          <a href={pageUrl("/models/wan22/")}>Wan2.2</a>
          <a href={pageUrl("/models/cosmos-predict25/")}>Cosmos-Predict2.5</a>
          <a href={pageUrl("/models/cosmos3-nano/")}>Cosmos3-Nano</a>
        </div>
        <div className="model-galleries">{galleries.map((gallery) => <ModelGallery key={gallery.model} gallery={gallery} />)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}

function ModelPage({ route }: { route: RouteDefinition }) {
  const gallery = galleries.find((item) => item.model === route.model) ?? galleries[0];
  const metrics = modelResults[gallery.model];
  return (
    <main>
      <SiteNav />
      <PageHero eyebrow="Model results" title={`SparsePR on ${gallery.model}.`} lead={metrics.summary} />
      <section className="content model-metrics" aria-label={`${gallery.model} SparsePR metrics`}>
        <div><strong>{metrics.density}</strong><span>executed-pair density</span></div>
        <div><strong>{metrics.speedup}</strong><span>end-to-end speedup</span></div>
        <div><strong>{metrics.psnr}</strong><span>PSNR</span></div>
        <div><strong>{metrics.ssim}</strong><span>SSIM</span></div>
        {metrics.pbench && <div><strong>{metrics.pbench}</strong><span>PBench</span></div>}
      </section>
      <section className="gallery-section model-page-gallery">
        <ModelGallery gallery={gallery} />
        <div className="page-actions"><a className="button primary" href={pageUrl("/results/")}>Full quantitative results</a><a className="button" href={pageUrl("/videos/")}>All video models</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default function App({ route = routeById.home }: { route?: RouteDefinition }) {
  if (route.kind === "method") return <MethodPage />;
  if (route.kind === "results") return <ResultsPage />;
  if (route.kind === "videos") return <VideosPage />;
  if (route.kind === "model") return <ModelPage route={route} />;
  return <HomePage />;
}
