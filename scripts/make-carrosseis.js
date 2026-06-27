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
// largura aproximada de um texto bold em Arial
function tw(t, fs) { const up = t === t.toUpperCase(); return Math.round(String(t).length * fs * (up ? 0.62 : 0.56)); }

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`;

/* ---------- fundos ---------- */
function bgDark(id = "d") {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#1a1411"/><stop offset="1" stop-color="#0a0705"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
const bgCream = () => `<rect width="${W}" height="${H}" fill="${CREAM}"/>`;
function bgOrange(id = "o") {
  return `<defs><radialGradient id="${id}" cx="28%" cy="18%" r="95%"><stop offset="0" stop-color="${ORANGE2}"/><stop offset="100%" stop-color="${ORANGE}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}

/* ---------- elementos comuns ---------- */
function pill(text, x, y, { onDark = true, solid = false } = {}) {
  const w = tw(text, 24) + 64;
  const stroke = onDark ? "#ffffff" : INK;
  const fill = solid ? ORANGE : "none";
  const txt = solid ? "#fff" : (onDark ? "#fff" : INK);
  return `<rect x="${x}" y="${y}" width="${w}" height="54" rx="27" fill="${fill}" ${solid ? "" : `stroke="${stroke}" stroke-width="2"`}/>` +
    `<text x="${x + w / 2}" y="${y + 36}" font-family="${F}" font-size="24" font-weight="800" fill="${txt}" text-anchor="middle" letter-spacing="1">${esc(text)}</text>`;
}

function bottomNav(light = false) {
  return `<text x="80" y="${H - 64}" font-family="${F}" font-size="27" font-weight="800" fill="${ORANGE}">@fornecedorvip</text>` +
    `<text x="${W - 80}" y="${H - 64}" font-family="${F}" font-size="27" font-weight="900" fill="${light ? INK : "#fff"}" text-anchor="end">Arrasta <tspan fill="${ORANGE}">→</tspan></text>`;
}
function bottomBrand(light = false) {
  return `<text x="${W / 2}" y="${H - 64}" font-family="${F}" font-size="27" font-weight="800" fill="${ORANGE}" text-anchor="middle">@fornecedorvip · fornecedorvip.shop</text>`;
}

// título com caixa de destaque sólida
function headline(lines, { x = 80, y, fs, lh, color = "#fff", boxColor = ORANGE, boxText = "#fff", anchor = "start" }) {
  return lines.map((l, i) => {
    const yy = y + i * lh;
    const cx = anchor === "middle" ? W / 2 : x;
    if (l.hl) {
      const w = tw(l.t, fs); const padX = Math.round(fs * 0.16);
      const bx = anchor === "middle" ? (W / 2 - w / 2 - padX) : x - padX;
      return `<rect x="${bx}" y="${Math.round(yy - fs * 0.82)}" width="${w + padX * 2}" height="${Math.round(fs * 1.04)}" fill="${boxColor}"/>` +
        `<text x="${cx}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${boxText}" text-anchor="${anchor}">${esc(l.t)}</text>`;
    }
    return `<text x="${cx}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${color}" text-anchor="${anchor}">${esc(l.t)}</text>`;
  }).join("");
}
// título com marca-texto (highlighter) atrás
function headlineMarker(lines, { x = 80, y, fs, lh }) {
  return lines.map((l, i) => {
    const yy = y + i * lh;
    let s = "";
    if (l.hl) {
      const w = tw(l.t, fs); const padX = Math.round(fs * 0.08);
      s += `<rect x="${x - padX}" y="${Math.round(yy - fs * 0.48)}" width="${w + padX * 2}" height="${Math.round(fs * 0.5)}" fill="${ORANGE}" opacity="0.85" rx="3"/>`;
    }
    s += `<text x="${x}" y="${yy}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${INK}">${esc(l.t)}</text>`;
    return s;
  }).join("");
}

function subText(sub, y, { x = 80, color = "rgba(255,255,255,0.85)", fs = 34, max = 40 } = {}) {
  if (!sub) return "";
  return wrap(sub, max).map((l, i) => `<text x="${x}" y="${y + i * 48}" font-family="${F}" font-size="${fs}" fill="${color}">${esc(l)}</text>`).join("");
}

/* ===================== CAPAS (1 estilo único por carrossel) ===================== */

// 1) Pôster laranja
function coverPoster({ eyebrow, lines, sub }) {
  const fs = 100, lh = 110, startY = 560;
  return svg(bgOrange()
    + pill(eyebrow, 80, 150, { onDark: true })
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: INK, boxText: "#fff" })
    + subText(sub, startY + lines.length * lh + 50, { color: "rgba(255,255,255,0.92)", max: 38 })
    + bottomNav(false));
}

// 2) Revista em creme (marca-texto)
function coverMarker({ eyebrow, lines, sub }) {
  const fs = 102, lh = 118, startY = 540;
  return svg(bgCream()
    + `<text x="80" y="200" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3">${esc(eyebrow)}</text>`
    + `<rect x="80" y="222" width="120" height="6" fill="${ORANGE}"/>`
    + headlineMarker(lines, { y: startY, fs, lh })
    + subText(sub, startY + lines.length * lh + 40, { color: "#6b5d54", max: 42 })
    + bottomNav(true));
}

// 3) Número gigante (escuro)
function coverBignum({ eyebrow, stat, lines, sub }) {
  const statFs = Math.min(330, Math.floor((W - 170) / (String(stat).length * 0.62)));
  return svg(bgDark()
    + pill(eyebrow, 80, 150)
    + `<text x="74" y="640" font-family="${F}" font-size="${statFs}" font-weight="900" fill="${ORANGE}">${esc(stat)}</text>`
    + headline(lines, { y: 830, fs: 76, lh: 86, color: "#fff", boxColor: ORANGE, boxText: "#fff" })
    + subText(sub, 830 + lines.length * 86 + 46, { color: "rgba(255,255,255,0.75)", max: 40 })
    + bottomNav(false));
}

// 4) Número gigante em círculo (creme)
function coverStatCream({ eyebrow, stat, lines, sub }) {
  const statFs = Math.min(220, Math.floor(560 / (String(stat).length * 0.6)));
  return svg(bgCream()
    + `<text x="80" y="200" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3">${esc(eyebrow)}</text>`
    + `<circle cx="540" cy="540" r="250" fill="none" stroke="${ORANGE}" stroke-width="10"/>`
    + `<text x="540" y="585" font-family="${F}" font-size="${statFs}" font-weight="900" fill="${ORANGE}" text-anchor="middle">${esc(stat)}</text>`
    + headline(lines, { y: 920, fs: 70, lh: 82, color: INK, boxColor: ORANGE, boxText: "#fff", anchor: "middle" })
    + (sub ? wrap(sub, 42).map((l, i) => `<text x="540" y="${920 + lines.length * 82 + 40 + i * 46}" font-family="${F}" font-size="32" fill="#6b5d54" text-anchor="middle">${esc(l)}</text>`).join("") : "")
    + bottomNav(true));
}

// 5) Citação gigante (escuro)
function coverQuote({ eyebrow, lines, sub }) {
  const fs = 84, lh = 100, startY = 560;
  return svg(bgDark()
    + pill(eyebrow, 80, 150)
    + `<text x="64" y="430" font-family="Georgia, serif" font-size="320" font-weight="900" fill="${ORANGE}" opacity="0.9">&#8220;</text>`
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: ORANGE, boxText: "#fff" })
    + subText(sub, startY + lines.length * lh + 46, { color: "rgba(255,255,255,0.7)", max: 42 })
    + bottomNav(false));
}

// 6) Conversa / DM (escuro)
function coverChat({ eyebrow, q, a, lines }) {
  const qLines = wrap(q, 24);
  const qh = qLines.length * 50 + 56;
  let s = bgDark() + pill(eyebrow, 80, 150);
  // bolão de pergunta (cinza, esquerda)
  s += `<rect x="80" y="300" width="760" height="${qh}" rx="34" fill="#26211d"/>`;
  s += qLines.map((l, i) => `<text x="120" y="${356 + i * 50}" font-family="${F}" font-size="40" fill="#fff">${esc(l)}</text>`).join("");
  // bolão de resposta (laranja, direita)
  const ay = 300 + qh + 36;
  const aw = tw(a, 56) + 80;
  s += `<rect x="${W - 80 - aw}" y="${ay}" width="${aw}" height="110" rx="34" fill="${ORANGE}"/>`;
  s += `<text x="${W - 80 - aw / 2}" y="${ay + 72}" font-family="${F}" font-size="56" font-weight="900" fill="#fff" text-anchor="middle">${esc(a)}</text>`;
  if (lines && lines.length) s += headline(lines, { y: ay + 320, fs: 66, lh: 78, color: "#fff", boxColor: ORANGE, boxText: "#fff" });
  s += bottomNav(false);
  return svg(s);
}

// 7) Grade / bento (creme)
function coverBento({ eyebrow, lines, blocks }) {
  let s = bgCream()
    + `<text x="80" y="200" font-family="${F}" font-size="26" font-weight="900" fill="${ORANGE}" letter-spacing="3">${esc(eyebrow)}</text>`
    + headline(lines, { y: 300, fs: 64, lh: 74, color: INK, boxColor: ORANGE, boxText: "#fff" });
  const cols = 2, gap = 28, x0 = 80, y0 = 560, bw = (W - 160 - gap) / cols, bh = 230;
  blocks.slice(0, 4).forEach((b, i) => {
    const cx = x0 + (i % cols) * (bw + gap);
    const cy = y0 + Math.floor(i / cols) * (bh + gap);
    const fill = b.skin === "orange" ? ORANGE : b.skin === "dark" ? DARK : b.skin === "green" ? GREEN : "#fff";
    const stroke = b.skin === "light" ? `stroke="${ORANGE}" stroke-width="3"` : "";
    const txt = b.skin === "light" ? INK : "#fff";
    s += `<rect x="${cx}" y="${cy}" width="${bw}" height="${bh}" rx="22" fill="${fill}" ${stroke}/>`;
    s += `<text x="${cx + bw / 2}" y="${cy + 110}" font-size="64" text-anchor="middle">${b.emoji}</text>`;
    s += `<text x="${cx + bw / 2}" y="${cy + 175}" font-family="${F}" font-size="30" font-weight="800" fill="${txt}" text-anchor="middle">${esc(b.label)}</text>`;
  });
  s += bottomNav(true);
  return svg(s);
}

// 8) Checklist / lista (escuro)
function coverChecklist({ eyebrow, big, word, tail, items }) {
  let s = bgDark() + pill(eyebrow, 80, 150);
  s += `<text x="74" y="430" font-family="${F}" font-size="300" font-weight="900" fill="${ORANGE}">${esc(big)}</text>`;
  s += `<text x="430" y="360" font-family="${F}" font-size="92" font-weight="900" fill="#fff">${esc(word)}</text>`;
  if (tail) s += subText(tail, 430, { x: 432, color: "rgba(255,255,255,0.75)", fs: 36, max: 22 });
  items.forEach((it, i) => {
    const y = 640 + i * 96;
    const faded = i === items.length - 1;
    s += `<rect x="80" y="${y - 44}" width="58" height="58" rx="12" fill="${ORANGE}" opacity="${faded ? 0.4 : 1}"/>`;
    s += `<text x="109" y="${y - 2}" font-family="${F}" font-size="34" font-weight="900" fill="#fff" text-anchor="middle" opacity="${faded ? 0.4 : 1}">${i + 1}</text>`;
    s += `<text x="160" y="${y}" font-family="${F}" font-size="40" font-weight="700" fill="#fff" opacity="${faded ? 0.4 : 1}">${esc(it)}</text>`;
  });
  s += bottomNav(false);
  return svg(s);
}

// 9) Split diagonal (escuro em cima, creme embaixo)
function coverDiagonal({ eyebrow, lines, sub }) {
  let s = bgCream();
  s += `<defs><linearGradient id="dg" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#1a1411"/><stop offset="1" stop-color="#0a0705"/></linearGradient></defs>`;
  s += `<polygon points="0,0 ${W},0 ${W},820 0,980" fill="url(#dg)"/>`;
  s += `<polygon points="0,980 ${W},820 ${W},858 0,1018" fill="${ORANGE}"/>`;
  s += pill(eyebrow, 80, 150);
  s += headline(lines, { y: 470, fs: 90, lh: 102, color: "#fff", boxColor: ORANGE, boxText: "#fff" });
  s += subText(sub, 1110, { x: 80, color: "#6b5d54", fs: 34, max: 42 });
  s += bottomNav(true);
  return svg(s);
}

// 10) Ranking top 3 (escuro)
function coverRanking({ eyebrow, lines, ranks }) {
  let s = bgDark() + pill(eyebrow, 80, 150);
  s += headline(lines, { y: 380, fs: 72, lh: 84, color: "#fff", boxColor: ORANGE, boxText: "#fff" });
  ranks.slice(0, 3).forEach((r, i) => {
    const y = 740 + i * 150;
    s += `<rect x="80" y="${y - 78}" width="920" height="124" rx="22" fill="#1f1814"/>`;
    s += `<circle cx="156" cy="${y - 16}" r="38" fill="${ORANGE}"/>`;
    s += `<text x="156" y="${y - 1}" font-family="${F}" font-size="44" font-weight="900" fill="#fff" text-anchor="middle">${i + 1}</text>`;
    s += `<text x="224" y="${y + 2}" font-family="${F}" font-size="46" font-weight="800" fill="#fff">${esc(r)}</text>`;
  });
  s += bottomNav(false);
  return svg(s);
}

/* ===================== SLIDES INTERNOS ===================== */
function contentSlide({ n, lines, body, skin = "dark" }) {
  const cream = skin === "cream", orange = skin === "orange";
  const bg = cream ? bgCream() : orange ? bgOrange() : bgDark();
  const titleColor = cream ? INK : "#fff";
  const bodyColor = cream ? "#5b5048" : orange ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)";
  const boxColor = orange ? INK : ORANGE;
  const numColor = cream ? ORANGE : orange ? "rgba(255,255,255,0.9)" : ORANGE;
  let startY, numSvg = "";
  if (n) { numSvg = `<text x="76" y="370" font-family="${F}" font-size="200" font-weight="900" fill="${numColor}">${esc(n)}</text>`; startY = 500; }
  else { numSvg = `<rect x="80" y="250" width="90" height="12" rx="6" fill="${boxColor}"/>`; startY = 360; }
  const titleFs = 74, titleLh = 84;
  const bodyY = startY + lines.length * titleLh + 55;
  return svg(bg + numSvg
    + headline(lines, { y: startY, fs: titleFs, lh: titleLh, color: titleColor, boxColor, boxText: "#fff" })
    + wrap(body, 38).map((l, i) => `<text x="80" y="${bodyY + i * 56}" font-family="${F}" font-size="38" fill="${bodyColor}">${esc(l)}</text>`).join("")
    + bottomNav(cream));
}

/* ===================== CTA (3 estilos) ===================== */
function ctaSlide({ style = "orange", lines, sub }) {
  const fs = 80, lh = 92, startY = 290;
  if (style === "cream") {
    return svg(bgCream()
      + headline(lines, { y: startY, fs, lh, color: INK, boxColor: ORANGE, boxText: "#fff" })
      + subText(sub, startY + lines.length * lh + 40, { color: "#6b5d54", max: 40 })
      + `<rect x="80" y="880" width="920" height="230" rx="22" fill="${ORANGE}"/>`
      + `<text x="540" y="950" font-family="${F}" font-size="32" fill="rgba(255,255,255,0.85)" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>`
      + `<text x="540" y="1055" font-family="${F}" font-size="104" font-weight="900" fill="#fff" text-anchor="middle">R$9,90</text>`
      + `<text x="540" y="1190" font-family="${F}" font-size="42" font-weight="900" fill="${ORANGE}" text-anchor="middle">👉 LINK NA BIO</text>`
      + bottomBrand(true));
  }
  if (style === "dark") {
    return svg(bgDark()
      + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: ORANGE, boxText: "#fff" })
      + subText(sub, startY + lines.length * lh + 40, { color: "rgba(255,255,255,0.8)", max: 40 })
      + `<rect x="80" y="880" width="920" height="230" rx="22" fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="14 12"/>`
      + `<text x="540" y="950" font-family="${F}" font-size="32" fill="rgba(255,255,255,0.6)" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>`
      + `<text x="540" y="1055" font-family="${F}" font-size="104" font-weight="900" fill="${ORANGE}" text-anchor="middle">R$9,90</text>`
      + `<text x="540" y="1190" font-family="${F}" font-size="42" font-weight="900" fill="#fff" text-anchor="middle">👉 LINK NA BIO</text>`
      + bottomBrand(false));
  }
  // orange
  return svg(bgOrange()
    + headline(lines, { y: startY, fs, lh, color: "#fff", boxColor: INK, boxText: "#fff" })
    + subText(sub, startY + lines.length * lh + 40, { color: "rgba(255,255,255,0.92)", max: 40 })
    + `<rect x="80" y="880" width="920" height="230" rx="22" fill="#fff"/>`
    + `<text x="540" y="950" font-family="${F}" font-size="32" fill="#9ca3af" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>`
    + `<text x="540" y="1055" font-family="${F}" font-size="104" font-weight="900" fill="${ORANGE}" text-anchor="middle">R$9,90</text>`
    + `<text x="540" y="1190" font-family="${F}" font-size="42" font-weight="900" fill="${INK}" text-anchor="middle">👉 LINK NA BIO</text>`
    + bottomBrand(false));
}

function renderCover(s) {
  switch (s.layout) {
    case "poster": return coverPoster(s);
    case "marker": return coverMarker(s);
    case "bignum": return coverBignum(s);
    case "statcream": return coverStatCream(s);
    case "quote": return coverQuote(s);
    case "chat": return coverChat(s);
    case "bento": return coverBento(s);
    case "checklist": return coverChecklist(s);
    case "diagonal": return coverDiagonal(s);
    case "ranking": return coverRanking(s);
    default: return coverPoster(s);
  }
}

const L = (t) => ({ t });
const HL = (t) => ({ t, hl: true });

/* ===================== CONTEÚDO ===================== */
const carrosseis = [
  {
    folder: "01-lojas-nao-pagam",
    cover: { layout: "poster", eyebrow: "REVENDA INTELIGENTE", lines: [L("As lojas NÃO"), L("pagam o que"), HL("você paga.")], sub: "Elas compram direto da fonte. E você também pode." },
    content: [
      { lines: [L("O segredo"), HL("é simples")], body: "Lojas compram no atacado, direto do fornecedor. Por isso vendem barato e ainda lucram. A diferença entre você e elas é só uma: saber ONDE comprar." },
      { lines: [L("Sem CNPJ,"), HL("sem mistério")], body: "A maioria dos fornecedores vende para pessoa física, com CPF. Dá para começar com menos de R$100 e sem pedido mínimo alto." },
      { lines: [L("Margem de"), HL("100% a 400%")], body: "Comprando no atacado, cada produto pode ser revendido por 2x a 4x o valor. É assim que se constrói uma renda extra de verdade." },
    ],
    cta: { lines: [L("Compre onde"), L("as lojas"), HL("compram.")], sub: "180 fornecedores verificados + 6 bônus, prontos pra começar hoje." },
  },
  {
    folder: "02-perdendo-dinheiro-varejo",
    cover: { layout: "marker", eyebrow: "PARE DE PERDER DINHEIRO", lines: [L("Você está"), L("perdendo grana"), HL("no varejo.")], sub: "Comprando caro pra revender barato. Isso acaba agora." },
    content: [
      { lines: [L("Pague o preço"), HL("de fábrica")], body: "Quem compra no varejo paga o lucro de 3 ou 4 intermediários. No atacado você compra direto da fonte e fica com toda a margem." },
      { lines: [L("Mesmo produto,"), HL("metade do preço")], body: "Aquele item que você revende? Existe um fornecedor vendendo ele bem mais barato. Você só precisa do contato certo." },
      { lines: [L("Lucro que sobra"), HL("no seu bolso")], body: "Comprando certo, cada venda rende muito mais. É a diferença entre vender por vender e realmente fazer uma renda." },
    ],
    cta: { lines: [L("Compre do"), HL("jeito certo.")], sub: "Acesse 180 fornecedores do atacado testados e aprovados." },
  },
  {
    folder: "03-comecar-com-100",
    cover: { layout: "bignum", eyebrow: "RENDA EXTRA", stat: "R$100", lines: [L("é tudo que você"), HL("precisa pra começar")], sub: "Sem CNPJ, sem experiência, do seu celular." },
    content: [
      { lines: [L("Não precisa de"), HL("muito dinheiro")], body: "Esqueça a ideia de investir milhares. A maioria dos fornecedores aceita pedidos pequenos, perfeitos pra quem está começando." },
      { lines: [L("Teste antes"), HL("de escalar")], body: "Compre pouco, venda, e reinvista o lucro. É assim que se cresce sem risco e sem dívida." },
      { lines: [L("Tudo do"), HL("seu celular")], body: "Você acha o fornecedor, anuncia no Instagram, WhatsApp ou Shopee e vende. Simples assim." },
    ],
    cta: { lines: [L("Comece sua"), HL("renda extra.")], sub: "180 fornecedores na palma da mão por menos do que um lanche." },
  },
  {
    folder: "04-5-erros-revenda",
    cover: { layout: "checklist", eyebrow: "ATENÇÃO REVENDEDORA", big: "5", word: "ERROS", tail: "que te impedem de lucrar", items: ["Comprar no varejo", "Não pesquisar fornecedor", "Errar o preço", "Achar que precisa de CNPJ", "Ficar só na teoria"] },
    content: [
      { n: "01", lines: [L("Comprar no varejo")], body: "Revender o que você comprou caro mata sua margem. Compre no atacado, direto do fornecedor." },
      { n: "02", lines: [L("Não pesquisar"), L("fornecedor")], body: "Cair no primeiro que aparece é receita pra golpe e preço ruim. Use fornecedores verificados." },
      { n: "03", lines: [L("Errar o preço")], body: "Vender sem calcular taxa e frete é trabalhar de graça. Precifique certo desde o início." },
      { n: "04", lines: [L("Achar que"), L("precisa de CNPJ")], body: "A maioria dos fornecedores vende pra CPF. Você pode começar como pessoa física hoje." },
      { n: "05", lines: [L("Ficar só"), L("na teoria")], body: "Esperar o momento perfeito é o erro mais caro. Quem age primeiro, vende primeiro." },
    ],
    cta: { lines: [L("Evite os erros"), HL("e comece certo.")], sub: "180 fornecedores verificados + guia de precificação." },
  },
  {
    folder: "05-lista-escondida",
    cover: { layout: "quote", eyebrow: "QUASE NINGUÉM CONTA", lines: [L("Existe uma lista"), L("que revendedores"), HL("escondem.")], sub: "Os fornecedores que abastecem as lojas que você admira." },
    content: [
      { lines: [L("Por que"), HL("escondem?")], body: "Quem achou o fornecedor certo não quer concorrência. Por isso a informação fica guardada a sete chaves." },
      { lines: [L("A fonte por trás"), HL("das lojas")], body: "Aquelas lojas de Instagram que vendem o dia todo? Elas compram dos mesmos fornecedores que você pode acessar." },
      { lines: [L("Informação"), HL("é vantagem")], body: "Quando você sabe de onde comprar, o jogo vira. Você compra barato, vende com margem e cresce." },
    ],
    cta: { lines: [L("Acesse a"), HL("lista completa.")], sub: "180 fornecedores direto da fonte. A vantagem que faltava." },
  },
  {
    folder: "06-mitos-cnpj",
    cover: { layout: "chat", eyebrow: "MITOS DA REVENDA", q: "Preciso de CNPJ pra revender?", a: "MITO ❌", lines: [L("E mais 2 mentiras"), HL("que te travam.")] },
    content: [
      { n: "01", lines: [L("Precisa de CNPJ")], body: "MITO. A maioria dos fornecedores vende pra pessoa física, com CPF. Dá pra começar hoje." },
      { n: "02", lines: [L("Precisa de"), L("muito dinheiro")], body: "MITO. Com menos de R$100 você já faz seu primeiro pedido e testa o mercado." },
      { n: "03", lines: [L("O mercado"), L("tá saturado")], body: "MITO. Todo dia milhões compram online. Espaço é o que não falta pra quem compra certo." },
    ],
    cta: { lines: [L("Pare de se"), HL("travar.")], sub: "180 fornecedores prontos pra você, sem CNPJ e sem burocracia." },
  },
  {
    folder: "07-o-que-vender-cada-mes",
    cover: { layout: "bento", eyebrow: "CALENDÁRIO DE VENDAS", lines: [L("O que vender"), HL("em cada mês")], blocks: [{ emoji: "💐", label: "Dia das Mães", skin: "orange" }, { emoji: "🧸", label: "Dia das Crianças", skin: "dark" }, { emoji: "🛍️", label: "Black Friday", skin: "light" }, { emoji: "🎄", label: "Natal", skin: "green" }] },
    content: [
      { lines: [L("Maio:"), HL("Dia das Mães")], body: "Perfumes, cosméticos, joias e moda feminina disparam. É a 2ª maior data do ano." },
      { lines: [L("Outubro:"), HL("Dia das Crianças")], body: "Brinquedos e games explodem. Pais e avós compram, e o ticket médio sobe." },
      { lines: [L("Nov e Dez:"), HL("Black Friday + Natal")], body: "O melhor período do ano. Quem prepara o estoque antes, fatura muito mais." },
    ],
    cta: { lines: [L("Saiba o que"), L("vender o"), HL("ano todo.")], sub: "Lista de fornecedores + calendário de sazonalidade completo." },
  },
  {
    folder: "08-quanto-da-pra-lucrar",
    cover: { layout: "statcream", eyebrow: "FAÇA AS CONTAS", stat: "400%", lines: [L("de lucro"), HL("revendendo certo")], sub: "Os números vão te surpreender." },
    content: [
      { lines: [L("Comprou por"), HL("R$20")], body: "Um produto no atacado por R$20 pode ser revendido por R$50 a R$80, dependendo do nicho." },
      { lines: [L("Vendeu por"), HL("R$60")], body: "Isso é R$40 de lucro em UMA venda. Faça 10 por semana e veja o resultado no fim do mês." },
      { lines: [L("Margem de"), HL("100% a 400%")], body: "Não é exagero: comprando direto do fornecedor, essa é a margem real de quem revende certo." },
    ],
    cta: { lines: [L("Comece a fazer"), HL("esses números.")], sub: "180 fornecedores com margem de verdade esperando por você." },
  },
  {
    folder: "09-passo-a-passo",
    cover: { layout: "diagonal", eyebrow: "PASSO A PASSO", lines: [L("Do fornecedor"), L("à 1ª venda em"), HL("4 passos.")], sub: "Salva esse post pra não esquecer." },
    content: [
      { n: "01", lines: [L("Escolha"), L("seu nicho")], body: "Roupas, beleza, acessórios? Comece pelo que você já gosta e entende." },
      { n: "02", lines: [L("Ache o"), L("fornecedor")], body: "Acesse a lista, escolha um fornecedor verificado e faça contato direto." },
      { n: "03", lines: [L("Anuncie"), L("e venda")], body: "Tire boas fotos, anuncie no Instagram, WhatsApp ou Shopee e comece a vender." },
      { n: "04", lines: [L("Reinvista"), L("e cresça")], body: "Use o lucro pra comprar mais e escalar. É assim que vira um negócio de verdade." },
    ],
    cta: { lines: [L("Dê o primeiro"), HL("passo agora.")], sub: "A lista de fornecedores que faltava pra você começar." },
  },
  {
    folder: "10-mais-vendidos",
    cover: { layout: "ranking", eyebrow: "TENDÊNCIA AGORA", lines: [L("Os produtos"), L("que mais"), HL("vendem.")], ranks: ["Beleza e cuidados", "Acessórios de celular", "Moda e fitness"] },
    content: [
      { lines: [L("Beleza"), HL("e cuidados")], body: "Maquiagem, skincare e perfumes têm procura o ano todo e recompra garantida." },
      { lines: [L("Acessórios"), HL("de celular")], body: "Capinhas, fones e carregadores: custo baixo, margem altíssima e demanda infinita." },
      { lines: [L("Moda"), HL("e fitness")], body: "Roupas, conjuntos e moda fitness vendem todo dia, em qualquer plataforma." },
    ],
    cta: { lines: [L("Acesse os"), L("fornecedores"), HL("certos.")], sub: "180 fornecedores das categorias que mais vendem hoje." },
  },
];

const SKINS = ["dark", "cream", "orange", "cream", "dark", "orange"];
const CTA_STYLES = ["orange", "dark", "cream"];

(async () => {
  const base = path.join("social", "carrosseis");
  fs.rmSync(base, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  let total = 0;
  for (let ci = 0; ci < carrosseis.length; ci++) {
    const c = carrosseis[ci];
    const dir = path.join(base, c.folder);
    fs.mkdirSync(dir, { recursive: true });
    const slides = [];
    slides.push(renderCover(c.cover));
    c.content.forEach((s, k) => {
      const skin = s.skin || SKINS[(ci + k) % SKINS.length];
      slides.push(contentSlide({ ...s, skin }));
    });
    slides.push(ctaSlide({ ...c.cta, style: CTA_STYLES[ci % CTA_STYLES.length] }));
    for (let i = 0; i < slides.length; i++) {
      await sharp(Buffer.from(slides[i])).jpeg({ quality: 90 }).toFile(path.join(dir, `slide-${i + 1}.jpg`));
      total++;
    }
    console.log("ok:", c.folder, "(" + slides.length + ")");
  }
  console.log("TOTAL:", total);
})();
