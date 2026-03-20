import fs from "node:fs";
import path from "node:path";

const requiredPaths = [
  "astro.config.mjs",
  "src/pages/index.astro",
  "src/components/SearchBox.astro",
  "public/pokemon.json",
];

for (const relativePath of requiredPaths) {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required project file: ${relativePath}`);
  }
}

console.log(`Verified ${requiredPaths.length} core project files.`);
