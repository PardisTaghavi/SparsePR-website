import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const key = "9d2fd068d886717c8b680a1f94a88e9d";
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = await readFile(join(projectRoot, "public", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (urlList.length === 0) {
  throw new Error("No URLs found in public/sitemap.xml");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "pardistaghavi.github.io",
    key,
    keyLocation: `https://pardistaghavi.github.io/SparsePR-website/${key}.txt`,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs (${response.status}).`);
