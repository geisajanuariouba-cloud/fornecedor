const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const F = "Arial, Helvetica, sans-serif";
const W = 1080, H = 1350;
const ORANGE = "#ea580c", ORANGE2 = "#ff7a2e", DARK = "#0d0d0d", CREAM = "#fff7ed", INK = "#141210", GREEN = "#16a34a";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(text, max) {
  const ws = String(text).split(" "); const o = []; let c = "";
  for (const w of ws) { if ((c + " " + w).trim().length <= max) c = (c + " " + w).trim(); else { if (c) o.push(c); c = w; } }
  if (c) o.push(c); return o;
}
function tw(t, fs) { const up = t === t.toUpperCase(); return Math.round(String(t).length * fs * (up ? 0.62 : 0.56)); }
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`;

function bgDark(id = "d") { return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#1a1411"/><stop offset="1" stop-color="#0a0705"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`; }
const bgCream = () => `<rect width="${W}" height="${H}" fill="${CREAM}"/>`;
function bgOrange(id = "o") { return `<defs><radialGradient id="${id}" cx="28%" cy="18%" r="95%"><stop offset="0" stop-color="${ORANGE2}"/><stop offset="100%" stop-color="${ORANGE}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`; }

function pill(text, x, y, { onDark = true } = {}) {
  const w = tw(text, 24) + 64; const stroke = onDark ? "#fff" : INK; const txt = onDark ? "#fff" : INK;
  return `<rect x="${x}" y="${y}" width="${w}" height="54" rx="27" fill="none" stroke="${stroke}" stroke-width="2"/>` +
    `<text x="${x + w / 2}" y="${y + 36}" font-family="${F}" font-size="24" font-weight="800" fill="${txt}" text-anchor="middle" letter-spacing="1">${esc(text)}</text>`;
}
function ctaPill(text, y) {
  const w = tw(text, 34) + 130; const x = (W - w) / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="92" rx="46" fill="${ORANGE}"/>` +
    `<text x="${W / 2}" y="${y + 60}" font-family="${F}" font-size="36" font-weight="900" fill="#fff" text-anchor="middle">${esc(text)} →</text>`;
}
function brand(light = false) {
  return `<text x="${W / 2}" y="${H - 70}" font-family="${F}" font-size="34" font-weight="900" fill="${ORANGE}" text-anchor="middle">@fornecedorvip</text>` +
    `<text x="${W / 2}" y="${H - 36}" font-family="${F}" font-size="24" font-weight="600" fill="${light ? "#9a8f86" : "rgba(255,255,255,0.5)"}" text-anchor="middle" letter-spacing="2">fornecedorvip.shop</text>`;
}
function headline(lines, { x = 80, y, fs, lh, color = "#fff", boxColor = ORANGE, boxText = "#fff", anchor = "start" }) {
  return lines.map((l, i) => {
    const yy = y + i * lh; const cx = anchor === "middle" ? W / 2 : x;
    if (l.hl) {
      const w = tw(l.t, fs); const padX = Math.round(fs * 0.16);
      const bx = anchor === "middle" ? (W / 2 - w / 2 - padX) : x - padX;
      return `<rect x="${bx}" y="${Math.round(yy - fs * 0.82)}" width="${w + padX * 2}" height="${Math.round(fs * 1.04)}" fill="${boxColor}"/>` +
        `<text x="${cx}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${boxText}" text-anchor="${anchor}">${esc(l.t)}</text>`;
    }
    return `<text x="${cx}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${color}" text-anchor="${anchor}">${esc(l.t)}</text>`;
  }).join("");
}
function headlineMarker(lines, { x = 80, y, fs, lh, anchor = "start" }) {
  return lines.map((l, i) => {
    const yy = y + i * lh; const cx = anchor === "middle" ? W / 2 : x; let s = "";
    if (l.hl) {
      const w = tw(l.t, fs); const padX = Math.round(fs * 0.08);
      const bx = anchor === "middle" ? (W / 2 - w / 2 - padX) : x - padX;
      s += `<rect x="${bx}" y="${Math.round(yy - fs * 0.48)}" width="${w + padX * 2}" height="${Math.round(fs * 0.5)}" fill="${ORANGE}" opacity="0.85" rx="3"/>`;
    }
    s += `<text x="${cx}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${INK}" text-anchor="${anchor}">${esc(l.t)}</text>`;
    return s;
  }).join("");
}
function subC(sub, y, { color = "rgba(255,255,255,0.8)", fs = 34, max = 38 } = {}) {
  if (!sub) return "";
  return wrap(sub, max).map((l, i) => `<text x="${W / 2}" y="${y + i * 46}" font-family="${F}" font-size="${fs}" fill="${color}" text-anchor="middle">${esc(l)}</text>`).join("");
}
const pc = (eb) => (W - (tw(eb, 24) + 64)) / 2; // x p/ centralizar pill

/* ===================== 10 ESTILOS DE POST ===================== */
function pPoster({ eyebrow, lines, sub, cta }) {
  const fs = 100, lh = 112, startY = 520;
  return svg(bgOrange() + pill(eyebrow, pc(eyebrow), 200)
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: INK, boxText: "#fff", anchor: "middle" })
    + subC(sub, startY + lines.length * lh + 50, { color: "rgba(255,255,255,0.92)" })
    + ctaPill(cta, 1080) + brand(false));
}
function pBignum({ eyebrow, stat, lines, cta }) {
  const statFs = Math.min(360, Math.floor((W - 160) / (String(stat).length * 0.62)));
  return svg(bgDark() + pill(eyebrow, pc(eyebrow), 200)
    + `<text x="${W / 2}" y="640" font-family="${F}" font-size="${statFs}" font-weight="900" fill="${ORANGE}" text-anchor="middle">${esc(stat)}</text>`
    + headline(lines, { y: 800, fs: 64, lh: 76, color: "#fff", boxColor: ORANGE, boxText: "#fff", anchor: "middle" })
    + ctaPill(cta, 1080) + brand(false));
}
function pMarker({ eyebrow, lines, sub, cta }) {
  const fs = 96, lh = 112, startY = 480;
  return svg(bgCream()
    + `<text x="${W / 2}" y="250" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3" text-anchor="middle">${esc(eyebrow)}</text>`
    + headlineMarker(lines, { y: startY, fs, lh, anchor: "middle" })
    + subC(sub, startY + lines.length * lh + 40, { color: "#6b5d54" })
    + ctaPill(cta, 1080) + brand(true));
}
function pQuote({ eyebrow, lines, sub, cta }) {
  const fs = 78, lh = 94, startY = 540;
  return svg(bgDark()
    + `<text x="${W / 2}" y="220" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3" text-anchor="middle">${esc(eyebrow)}</text>`
    + `<text x="${W / 2}" y="430" font-family="Georgia, serif" font-size="240" font-weight="900" fill="${ORANGE}" text-anchor="middle">&#8220;</text>`
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: ORANGE, boxText: "#fff", anchor: "middle" })
    + subC(sub, startY + lines.length * lh + 46, { color: "rgba(255,255,255,0.7)" })
    + ctaPill(cta, 1080) + brand(false));
}
function pChat({ eyebrow, q, a, cta }) {
  const qLines = wrap(q, 24); const qh = qLines.length * 50 + 56;
  let s = bgDark() + `<text x="${W / 2}" y="220" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3" text-anchor="middle">${esc(eyebrow)}</text>`;
  s += `<rect x="80" y="380" width="760" height="${qh}" rx="34" fill="#26211d"/>`;
  s += qLines.map((l, i) => `<text x="120" y="${436 + i * 50}" font-family="${F}" font-size="40" fill="#fff">${esc(l)}</text>`).join("");
  const ay = 380 + qh + 40; const aw = tw(a, 56) + 80;
  s += `<rect x="${W - 80 - aw}" y="${ay}" width="${aw}" height="110" rx="34" fill="${ORANGE}"/>`;
  s += `<text x="${W - 80 - aw / 2}" y="${ay + 72}" font-family="${F}" font-size="56" font-weight="900" fill="#fff" text-anchor="middle">${esc(a)}</text>`;
  s += ctaPill(cta, 1080) + brand(false);
  return svg(s);
}
function pStatCream({ eyebrow, stat, lines, cta }) {
  const statFs = Math.min(210, Math.floor(540 / (String(stat).length * 0.6)));
  return svg(bgCream()
    + `<text x="${W / 2}" y="230" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3" text-anchor="middle">${esc(eyebrow)}</text>`
    + `<circle cx="540" cy="560" r="250" fill="none" stroke="${ORANGE}" stroke-width="10"/>`
    + `<text x="540" y="605" font-family="${F}" font-size="${statFs}" font-weight="900" fill="${ORANGE}" text-anchor="middle">${esc(stat)}</text>`
    + headline(lines, { y: 940, fs: 64, lh: 76, color: INK, boxColor: ORANGE, boxText: "#fff", anchor: "middle" })
    + ctaPill(cta, 1110) + brand(true));
}
function pStatement({ eyebrow, lines, sub, cta }) {
  const fs = 92, lh = 106, startY = 470;
  return svg(bgDark() + pill(eyebrow, pc(eyebrow), 200)
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: ORANGE, boxText: "#fff", anchor: "middle" })
    + subC(sub, startY + lines.length * lh + 46, { color: "rgba(255,255,255,0.7)" })
    + ctaPill(cta, 1080) + brand(false));
}
function pChecklist({ eyebrow, lines, items, cta }) {
  let s = bgCream()
    + `<text x="80" y="220" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3">${esc(eyebrow)}</text>`
    + headline(lines, { y: 340, fs: 66, lh: 78, color: INK, boxColor: ORANGE, boxText: "#fff" });
  items.slice(0, 4).forEach((it, i) => {
    const y = 640 + i * 110;
    s += `<circle cx="112" cy="${y - 14}" r="30" fill="${GREEN}"/>`;
    s += `<path d="M99 ${y - 14} l9 9 l16 -18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<text x="162" y="${y}" font-family="${F}" font-size="40" font-weight="700" fill="${INK}">${esc(it)}</text>`;
  });
  s += ctaPill(cta, 1110) + brand(true);
  return svg(s);
}
function pDiagonal({ eyebrow, lines, sub, cta }) {
  let s = bgCream();
  s += `<defs><linearGradient id="pdg" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#1a1411"/><stop offset="1" stop-color="#0a0705"/></linearGradient></defs>`;
  s += `<polygon points="0,0 ${W},0 ${W},760 0,920" fill="url(#pdg)"/>`;
  s += `<polygon points="0,920 ${W},760 ${W},798 0,958" fill="${ORANGE}"/>`;
  s += `<text x="80" y="180" font-family="${F}" font-size="26" font-weight="900" fill="#fff" letter-spacing="3">${esc(eyebrow)}</text>`;
  s += headline(lines, { y: 430, fs: 82, lh: 96, color: "#fff", boxColor: ORANGE, boxText: "#fff" });
  s += subC(sub, 1050, { color: "#6b5d54", max: 40 });
  s += ctaPill(cta, 1140) + brand(true);
  return svg(s);
}
function pCompare({ eyebrow, before, after, lines, cta }) {
  let s = bgDark() + pill(eyebrow, pc(eyebrow), 200);
  const cy = 360, ch = 300, cw = 430, gap = 40, x0 = (W - cw * 2 - gap) / 2;
  s += `<rect x="${x0}" y="${cy}" width="${cw}" height="${ch}" rx="22" fill="#26211d"/>`;
  s += `<text x="${x0 + cw / 2}" y="${cy + 70}" font-family="${F}" font-size="30" font-weight="800" fill="#9a8f86" text-anchor="middle">VAREJO</text>`;
  s += `<text x="${x0 + cw / 2}" y="${cy + 205}" font-family="${F}" font-size="84" font-weight="900" fill="#fff" text-anchor="middle">${esc(before)}</text>`;
  const x1 = x0 + cw + gap;
  s += `<rect x="${x1}" y="${cy}" width="${cw}" height="${ch}" rx="22" fill="${ORANGE}"/>`;
  s += `<text x="${x1 + cw / 2}" y="${cy + 70}" font-family="${F}" font-size="30" font-weight="800" fill="rgba(255,255,255,0.85)" text-anchor="middle">ATACADO</text>`;
  s += `<text x="${x1 + cw / 2}" y="${cy + 205}" font-family="${F}" font-size="84" font-weight="900" fill="#fff" text-anchor="middle">${esc(after)}</text>`;
  s += headline(lines, { y: 850, fs: 64, lh: 76, color: "#fff", boxColor: ORANGE, boxText: "#fff", anchor: "middle" });
  s += ctaPill(cta, 1080) + brand(false);
  return svg(s);
}

const L = (t) => ({ t });
const HL = (t) => ({ t, hl: true });

const posts = [
  { folder: "01-180-fornecedores", style: "bignum", eyebrow: "LISTA COMPLETA", stat: "180", lines: [L("fornecedores"), HL("numa lista só")], cta: "Garanta a sua" },
  { folder: "02-lojas-compram-aqui", style: "poster", eyebrow: "REVENDA INTELIGENTE", lines: [L("As lojas"), HL("compram aqui.")], sub: "Direto da fonte, no atacado. E você também pode.", cta: "Descobrir onde" },
  { folder: "03-margem-400", style: "statcream", eyebrow: "ATACADO REAL", stat: "400%", lines: [L("de margem"), HL("por produto")], cta: "Acessar agora" },
  { folder: "04-pare-varejo", style: "marker", eyebrow: "PARE DE PERDER", lines: [L("Pare de comprar"), L("no varejo pra"), HL("revender.")], sub: "Compre na fonte e fique com toda a margem.", cta: "Comprar certo" },
  { folder: "05-sem-cnpj", style: "chat", eyebrow: "MITOS DA REVENDA", q: "Preciso de CNPJ pra começar?", a: "MITO ❌", cta: "Quero começar" },
  { folder: "06-comeca-com-100", style: "compare", eyebrow: "BAIXO INVESTIMENTO", before: "Caro", after: "R$100", lines: [L("é o quanto basta"), HL("pra começar")], cta: "Começar hoje" },
  { folder: "07-renda-extra", style: "statement", eyebrow: "RENDA EXTRA", lines: [L("Sua renda"), L("extra começa"), HL("hoje.")], sub: "180 fornecedores prontos pra você começar agora.", cta: "Garantir lista" },
  { folder: "08-mais-vendidos", style: "checklist", eyebrow: "TENDÊNCIA AGORA", lines: [L("O que mais"), HL("vende agora")], items: ["Beleza e cosméticos", "Acessórios de celular", "Moda e fitness", "Itens para casa"], cta: "Ver fornecedores" },
  { folder: "09-prova-social", style: "diagonal", eyebrow: "PROVA SOCIAL", lines: [L("+5 mil"), L("revendedoras"), HL("já usam.")], sub: "Elas compram direto da fonte com esta lista.", cta: "Fazer parte" },
  { folder: "10-contato-certo", style: "quote", eyebrow: "A VERDADE", lines: [L("Não falta"), L("dinheiro. Falta"), HL("o contato certo.")], sub: "180 fornecedores verificados, prontos pra você.", cta: "Quero o acesso" },
];

function render(p) {
  switch (p.style) {
    case "poster": return pPoster(p);
    case "bignum": return pBignum(p);
    case "marker": return pMarker(p);
    case "quote": return pQuote(p);
    case "chat": return pChat(p);
    case "statcream": return pStatCream(p);
    case "statement": return pStatement(p);
    case "checklist": return pChecklist(p);
    case "diagonal": return pDiagonal(p);
    case "compare": return pCompare(p);
    default: return pPoster(p);
  }
}

(async () => {
  const base = path.join("social", "posts");
  fs.rmSync(base, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  for (const p of posts) {
    const dir = path.join(base, p.folder);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(Buffer.from(render(p))).jpeg({ quality: 90 }).toFile(path.join(dir, "post.jpg"));
    console.log("ok:", p.folder, "(" + p.style + ")");
  }
  console.log("TOTAL: 10 posts");
})();
