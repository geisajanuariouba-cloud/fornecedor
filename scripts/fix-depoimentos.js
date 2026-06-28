// Recorta os 6 depoimentos da grid e cobre o label "VARIAÇÃO X / DEPOIMENTO"
// amostrando a cor de fundo e pintando um retângulo sobre a área do texto.
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/conta/Downloads/ChatGPT Image 27_06_2026, 22_50_16.png";
const OUT_DIR = path.join(__dirname, "../public/depoimentos");

async function main() {
  const meta = await sharp(SRC).metadata();
  const W = meta.width;   // 1707
  const H = meta.height;  // 921
  const cols = 3, rows = 2;
  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);

  // Área aproximada do label (top-left de cada célula)
  // Ajuste LBL_H se o texto for mais alto/mais baixo
  const LBL_X = 0, LBL_Y = 0;
  const LBL_W = cellW, LBL_H = 52; // cobre a faixa do topo onde fica "VARIAÇÃO X"

  let idx = 4;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 1. Extrai a célula
      const cell = await sharp(SRC)
        .extract({ left: c * cellW, top: r * cellH, width: cellW, height: cellH })
        .toBuffer();

      // 2. Amostra a cor de fundo: pega um pixel no canto inferior-direito da faixa do label
      //    (longe do texto mas dentro da mesma área de cor)
      const samplePixel = await sharp(cell)
        .extract({ left: cellW - 10, top: 8, width: 1, height: 1 })
        .raw()
        .toBuffer();
      const [r2, g2, b2] = [samplePixel[0], samplePixel[1], samplePixel[2]];

      // 3. Cria retângulo da cor de fundo para cobrir o label
      const cover = await sharp({
        create: { width: LBL_W, height: LBL_H, channels: 3, background: { r: r2, g: g2, b: b2 } }
      }).png().toBuffer();

      // 4. Compõe: cola o retângulo em cima do label
      const clean = await sharp(cell)
        .composite([{ input: cover, left: LBL_X, top: LBL_Y }])
        .webp({ quality: 85 })
        .toBuffer();

      const outPath = path.join(OUT_DIR, `dep${idx}.webp`);
      await require("fs").promises.writeFile(outPath, clean);
      console.log(`dep${idx}.webp — fundo RGB(${r2},${g2},${b2})`);
      idx++;
    }
  }
  console.log("Pronto.");
}

main().catch(console.error);
