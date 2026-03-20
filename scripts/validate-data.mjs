import fs from "node:fs";
import path from "node:path";

const filePath = path.resolve("public/pokemon.json");
const raw = fs.readFileSync(filePath, "utf8");
const data = JSON.parse(raw);

if (!Array.isArray(data) || data.length === 0) {
  throw new Error("public/pokemon.json must be a non-empty array");
}

const requiredKeys = [
  "managementId",
  "pokemonName",
  "dexNo",
  "generation",
  "game",
  "eventName",
  "distributionMethod",
];

for (const [index, entry] of data.entries()) {
  for (const key of requiredKeys) {
    if (!(key in entry)) {
      throw new Error(`Entry ${index} is missing required key: ${key}`);
    }
  }
}

console.log(`Validated ${data.length} distribution entries.`);
