import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const suspectPath = path.resolve("public/images/pokemon");
const backupPath = path.resolve(".pokemon-images-build-backup");

let moved = false;

try {
  if (fs.existsSync(suspectPath)) {
    fs.renameSync(suspectPath, backupPath);
    moved = true;
  }

  const result = spawnSync("npx", ["astro", "build"], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  if (moved && fs.existsSync(backupPath) && !fs.existsSync(suspectPath)) {
    fs.renameSync(backupPath, suspectPath);
  }
}