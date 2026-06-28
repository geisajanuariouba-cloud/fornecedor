// Crop 6 testimonials from the 3×2 grid image → public/depoimentos/dep4-dep9.webp
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = "C:/Users/conta/Downloads/ChatGPT Image 27_06_2026, 22_50_16.png";
const OUT_DIR = path.join(__dirname, "../public/depoimentos");

async function main() {
  const meta = await sharp(SRC).metadata();
  const W = meta.width;   // 1707
  const H = meta.height;  // 921

  const cols = 3, rows = 2;
  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);

  let idx = 4;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const outPath = path.join(OUT_DIR, `dep${idx}.webp`);
      await sharp(SRC)
        .extract({ left: c * cellW, top: r * cellH, width: cellW, height: cellH })
        .webp({ quality: 82 })
        .toFile(outPath);
      console.log(`Saved dep${idx}.webp (${cellW}×${cellH})`);
      idx++;
    }
  }
  console.log("Done.");
}

main().catch(console.error);
