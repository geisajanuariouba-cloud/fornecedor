const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const F = "Arial, Helvetica, sans-serif";
const W = 1080, H = 1350;
const ORANGE = "#ea580c";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, maxChars) {
  const words = String(text).split(" ");
  const lines = []; let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) cur = (cur + " " + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// fundo escuro premium com glow laranja + anéis concêntricos
function backdrop() {
  let rings = "";
  for (const r of [200, 330, 460, 590, 720]) {
    rings += `<circle cx="540" cy="560" r="${r}" fill="none" stroke="${ORANGE}" stroke-opacity="0.10" stroke-width="1.5"/>`;
  }
  return `
    <defs>
      <radialGradient id="glow" cx="50%" cy="38%" r="55%">
        <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.45"/>
        <stop offset="45%" stop-color="${ORANGE}" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="num" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${ORANGE}"/>
      </linearGradient>
      <linearGradient id="pill" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff7a2e"/>
        <stop offset="100%" stop-color="${ORANGE}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="#0a0705"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${rings}`;
}

function ctaPill(text, y) {
  const w = Math.round(text.length * 22) + 120;
  const x = (W - w) / 2;
  // halo (sem filtro): retângulos translúcidos atrás
  let halo = "";
  for (const [d, op] of [[26, 0.10], [16, 0.16], [8, 0.24]]) {
    halo += `<rect x="${x - d}" y="${y - d}" width="${w + d * 2}" height="${96 + d * 2}" rx="${48 + d}" fill="${ORANGE}" opacity="${op}"/>`;
  }
  return `${halo}
    <rect x="${x}" y="${y}" width="${w}" height="96" rx="48" fill="url(#pill)"/>
    <text x="${W / 2}" y="${y + 62}" font-family="${F}" font-size="36" font-weight="800" fill="#ffffff" text-anchor="middle">${esc(text)} ↗</text>`;
}

function brand() {
  return `<text x="${W / 2}" y="${H - 90}" font-family="${F}" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">Fornecedor<tspan fill="${ORANGE}">Vip</tspan></text>
    <text x="${W / 2}" y="${H - 52}" font-family="${F}" font-size="24" font-weight="600" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="2">fornecedorvip.shop</text>`;
}

function eyebrow(text) {
  const w = Math.round(text.length * 13) + 70;
  const x = (W - w) / 2;
  return `<rect x="${x}" y="250" width="${w}" height="52" rx="26" fill="rgba(255,255,255,0.06)" stroke="${ORANGE}" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="${W / 2}" y="284" font-family="${F}" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${esc(text)}</text>`;
}

// LAYOUT 1: número/estatística grande
function postStat({ eyebrow: eb, stat, lines, cta }) {
  const titleLines = lines; // [{t,hl}]
  const startY = 880;
  const lh = 78;
  const tl = titleLines.map((l, i) => {
    const y = startY + i * lh;
    if (l.hl) {
      const w = Math.round(l.t.length * 38) + 36;
      return `<rect x="${(W - w) / 2}" y="${y - 56}" width="${w}" height="74" fill="${ORANGE}"/><text x="${W / 2}" y="${y}" font-family="${F}" font-size="62" font-weight="900" fill="#fff" text-anchor="middle">${esc(l.t)}</text>`;
    }
    return `<text x="${W / 2}" y="${y}" font-family="${F}" font-size="62" font-weight="800" fill="#ffffff" text-anchor="middle">${esc(l.t)}</text>`;
  }).join("");
  const ctaY = startY + titleLines.length * lh + 60;
  // tamanho do número dinâmico pra nunca estourar a largura (máx ~940px)
  const statFs = Math.min(300, Math.floor(940 / (stat.length * 0.60)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${backdrop()}
    ${eb ? eyebrow(eb) : ""}
    <text x="${W / 2}" y="640" font-family="${F}" font-size="${statFs}" font-weight="900" fill="url(#num)" text-anchor="middle">${esc(stat)}</text>
    ${tl}
    ${ctaPill(cta, ctaY)}
    ${brand()}
  </svg>`;
}

// LAYOUT 2: frase de impacto grande
function postStatement({ eyebrow: eb, lines, sub, cta }) {
  const startY = 540;
  const fs = 92, lh = 104;
  const tl = lines.map((l, i) => {
    const y = startY + i * lh;
    if (l.hl) {
      const w = Math.round(l.t.length * 56) + 48;
      return `<rect x="${(W - w) / 2}" y="${y - 82}" width="${w}" height="108" fill="${ORANGE}"/><text x="${W / 2}" y="${y}" font-family="${F}" font-size="${fs}" font-weight="900" fill="#fff" text-anchor="middle">${esc(l.t)}</text>`;
    }
    return `<text x="${W / 2}" y="${y}" font-family="${F}" font-size="${fs}" font-weight="900" fill="#ffffff" text-anchor="middle">${esc(l.t)}</text>`;
  }).join("");
  let subSvg = "";
  const ctaBaseY = startY + lines.length * lh + 60;
  let ctaY = ctaBaseY;
  if (sub) {
    const sl = wrap(sub, 42);
    subSvg = sl.map((l, i) => `<text x="${W / 2}" y="${ctaBaseY + i * 48}" font-family="${F}" font-size="34" fill="rgba(255,255,255,0.7)" text-anchor="middle">${esc(l)}</text>`).join("");
    ctaY = ctaBaseY + sl.length * 48 + 50;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${backdrop()}
    ${eb ? eyebrow(eb) : ""}
    ${tl}
    ${subSvg}
    ${ctaPill(cta, ctaY)}
    ${brand()}
  </svg>`;
}

const L = (t) => ({ t });
const HL = (t) => ({ t, hl: true });

const posts = [
  { folder: "01-180-fornecedores", layout: "stat", eyebrow: "LISTA COMPLETA", stat: "180", lines: [L("fornecedores verificados"), HL("numa lista só.")], cta: "Garanta a sua" },
  { folder: "02-5000-revendedoras", layout: "stat", eyebrow: "PROVA SOCIAL", stat: "+5MIL", lines: [L("revendedoras já compram"), HL("direto da fonte.")], cta: "Quero fazer parte" },
  { folder: "03-margem-400", layout: "stat", eyebrow: "ATACADO REAL", stat: "400%", lines: [L("de margem por produto"), HL("comprando no atacado.")], cta: "Acessar fornecedores" },
  { folder: "04-preco-990", layout: "stat", eyebrow: "OFERTA", stat: "R$9,90", lines: [L("o preço de começar"), HL("a sua renda extra.")], cta: "Comece hoje" },
  { folder: "05-menos-de-100", layout: "stat", eyebrow: "BAIXO INVESTIMENTO", stat: "R$100", lines: [L("é o quanto basta pra dar"), HL("o primeiro passo.")], cta: "Quero começar" },
  { folder: "06-14-categorias", layout: "stat", eyebrow: "VARIEDADE", stat: "14", lines: [L("categorias de produtos"), HL("pra você escolher.")], cta: "Ver categorias" },
  { folder: "07-lojas-compram-aqui", layout: "statement", eyebrow: "REVENDA INTELIGENTE", lines: [L("As lojas"), L("compram"), HL("aqui.")], sub: "Direto da fonte, no atacado. E você também pode.", cta: "Descobrir onde" },
  { folder: "08-sem-cnpj", layout: "statement", eyebrow: "SEM DESCULPA", lines: [L("Sem CNPJ."), L("Sem pedido"), HL("mínimo.")], sub: "Comece a revender hoje, como pessoa física.", cta: "Quero começar" },
  { folder: "09-pare-varejo", layout: "statement", eyebrow: "PARE DE PERDER", lines: [L("Pare de comprar"), L("no varejo pra"), HL("revender.")], sub: "Compre na fonte e fique com toda a margem.", cta: "Comprar do jeito certo" },
  { folder: "10-renda-comeca-hoje", layout: "statement", eyebrow: "RENDA EXTRA", lines: [L("Sua renda"), L("extra começa"), HL("hoje.")], sub: "180 fornecedores prontos pra você começar agora.", cta: "Garantir minha lista" },
];

(async () => {
  const base = path.join("social", "posts");
  fs.rmSync(base, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  for (const p of posts) {
    const dir = path.join(base, p.folder);
    fs.mkdirSync(dir, { recursive: true });
    const svg = p.layout === "stat" ? postStat(p) : postStatement(p);
    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(path.join(dir, "post.jpg"));
    console.log("ok:", p.folder);
  }
  console.log("TOTAL: 10 posts");
})();
