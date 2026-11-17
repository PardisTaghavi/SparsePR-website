import { writeFile } from "node:fs/promises";
import { geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "@d3-maps/atlas/world/countries/countries-110m";

const visitedCountries = [
  "USA", "CHN", "SGP", "HKG", "KOR", "JPN", "NLD", "CAN", "DEU",
  "IND", "BRA", "IRL", "ISR", "MEX", "RUS", "SRB", "AUS", "COL",
  "FRA", "ITA", "NZL", "POL", "TWN", "TUR", "GBR", "UZB", "BLR",
  "ISL",
];

const fallbackCoordinates = {
  HKG: [114.1694, 22.3193],
  SGP: [103.8198, 1.3521],
};

const countries = feature(world, world.objects.features).features;
const byIso = new Map(countries.map((country) => [country.properties.id, country]));
const projection = geoNaturalEarth1().fitExtent(
  [[12, 12], [948, 458]],
  { type: "FeatureCollection", features: countries },
);
const path = geoPath(projection);

const countryPaths = countries
  .map((country) => `<path d="${path(country)}"/>`)
  .join("");

const dots = visitedCountries
  .map((iso) => {
    const country = byIso.get(iso);
    const coordinates = country ? geoCentroid(country) : fallbackCoordinates[iso];
    const point = coordinates ? projection(coordinates) : null;
    return point
      ? `<circle cx="${point[0].toFixed(2)}" cy="${point[1].toFixed(2)}" r="5"/>`
      : "";
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 398" role="img" aria-labelledby="title description">
  <title id="title">Countries that have visited the SparsePR website</title>
  <desc id="description">A world map with black dots marking ${visitedCountries.length} countries with website visitors.</desc>
  <g fill="#e5e7eb" stroke="#ffffff" stroke-width="1.1" vector-effect="non-scaling-stroke">${countryPaths}</g>
  <g fill="#111111" stroke="#ffffff" stroke-width="1.8" vector-effect="non-scaling-stroke">${dots}</g>
</svg>
`;

await writeFile(new URL("../public/media/figures/visitor-map.svg", import.meta.url), svg);
