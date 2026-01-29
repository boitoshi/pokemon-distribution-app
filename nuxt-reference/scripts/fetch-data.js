// scripts/fetch-data.js
import fs from "fs";
import https from "https";

const url =
  "https://raw.githubusercontent.com/boitoshi/pokemon-data/main/event-pokemon/gen8_dist_list.json";
const dest = "./public/pokemon.json";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    fs.writeFileSync(dest, data);
    console.log("✅ pokemon.json を public フォルダに保存しました！");
  });
});
