const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const F = "Arial, Helvetica, sans-serif";
const W = 1080, H = 1350;

// Paleta do site
const ORANGE = "#ea580c", CREAM = "#fff7ed", GREEN = "#16a34a", DARK = "#111111", MUTED = "#9ca3af";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Quebra texto em linhas por nº aproximado de caracteres
function wrap(text, maxChars) {
  const words = String(text).split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) cur = (cur + " " + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function tspans(lines, x, startY, lineH, attrs) {
  return lines.map((l, i) => `<text x="${x}" y="${startY + i * lineH}" ${attrs}>${esc(l)}</text>`).join("");
}

function brandFooter(color) {
  return `<text x="${W / 2}" y="${H - 70}" font-family="${F}" font-size="30" font-weight="800" fill="${color}" text-anchor="middle">Fornecedor<tspan fill="${color === "#ffffff" ? ORANGE : DARK}">Vip</tspan> <tspan font-weight="400" fill="${MUTED}">· fornecedorvip.shop</tspan></text>`;
}

// ---------- LAYOUTS ----------
function slideHook({ eyebrow, lines, sub }) {
  // lines: [{t, hl?}]
  const big = lines.map((l, i) => `<text x="80" y="${520 + i * 110}" font-family="${F}" font-size="92" font-weight="900" fill="${l.hl ? ORANGE : "#ffffff"}">${esc(l.t)}</text>`).join("");
  const subLines = sub ? wrap(sub, 40) : [];
  const subY = 520 + lines.length * 110 + 50;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#1a0800"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="0" y="0" width="${W}" height="14" fill="${ORANGE}"/>
    <rect x="80" y="150" width="${(esc(eyebrow).length * 19) + 56}" height="58" rx="29" fill="${ORANGE}"/>
    <text x="${80 + 28}" y="189" font-family="${F}" font-size="26" font-weight="800" fill="#fff">${esc(eyebrow)}</text>
    ${big}
    ${tspans(subLines, 80, subY, 50, `font-family="${F}" font-size="36" fill="rgba(255,255,255,0.72)"`)}
    <text x="80" y="${H - 150}" font-family="${F}" font-size="34" font-weight="800" fill="${ORANGE}">Arrasta para o lado →</text>
    ${brandFooter("#ffffff")}
  </svg>`;
}

function slideText({ n, title, body, theme = "cream" }) {
  const bg = theme === "cream" ? CREAM : "#0d0d0d";
  const titleColor = theme === "cream" ? DARK : "#ffffff";
  const bodyColor = theme === "cream" ? "#444" : "rgba(255,255,255,0.78)";
  const titleLines = wrap(title, 22);
  const bodyLines = wrap(body, 38);
  const titleY = 360;
  const bodyY = titleY + titleLines.length * 78 + 60;
  const numBadge = n
    ? `<circle cx="135" cy="245" r="55" fill="${ORANGE}"/><text x="135" y="265" font-family="${F}" font-size="50" font-weight="900" fill="#fff" text-anchor="middle">${esc(n)}</text>`
    : `<rect x="80" y="210" width="90" height="10" rx="5" fill="${ORANGE}"/>`;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="0" y="0" width="${W}" height="14" fill="${ORANGE}"/>
    ${numBadge}
    ${tspans(titleLines, 80, titleY, 78, `font-family="${F}" font-size="64" font-weight="900" fill="${titleColor}"`)}
    ${tspans(bodyLines, 80, bodyY, 56, `font-family="${F}" font-size="38" fill="${bodyColor}"`)}
    ${brandFooter(theme === "cream" ? DARK : "#ffffff")}
  </svg>`;
}

function slideCTA({ headline, sub }) {
  const hLines = wrap(headline, 20);
  const subLines = sub ? wrap(sub, 36) : [];
  const hY = 320;
  const subY = hY + hLines.length * 88 + 40;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${ORANGE}"/>
    <rect x="0" y="0" width="${W}" height="14" fill="#fff"/>
    ${tspans(hLines, 80, hY, 88, `font-family="${F}" font-size="74" font-weight="900" fill="#ffffff"`)}
    ${tspans(subLines, 80, subY, 52, `font-family="${F}" font-size="36" fill="rgba(255,255,255,0.9)"`)}

    <rect x="80" y="900" width="920" height="220" rx="24" fill="#ffffff"/>
    <text x="540" y="975" font-family="${F}" font-size="34" fill="#9ca3af" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>
    <text x="540" y="1065" font-family="${F}" font-size="96" font-weight="900" fill="${ORANGE}" text-anchor="middle">R$9,90</text>

    <text x="540" y="1200" font-family="${F}" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">👉 LINK NA BIO</text>
    <text x="540" y="1255" font-family="${F}" font-size="32" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle">fornecedorvip.shop</text>
  </svg>`;
}

function render(def) {
  if (def.layout === "hook") return slideHook(def);
  if (def.layout === "cta") return slideCTA(def);
  return slideText(def);
}

// ============ OS 10 CARROSSÉIS ============
const carrosseis = [
  {
    folder: "01-lojas-nao-pagam",
    slides: [
      { layout: "hook", eyebrow: "REVENDA INTELIGENTE", lines: [{ t: "As lojas NÃO" }, { t: "pagam o que" }, { t: "você paga.", hl: true }], sub: "Elas compram direto da fonte. E você também pode." },
      { layout: "text", title: "O segredo é simples", body: "Lojas compram no atacado, direto do fornecedor. Por isso vendem barato e ainda lucram. A diferença entre você e elas é só uma: saber ONDE comprar." },
      { layout: "text", title: "Sem CNPJ, sem mistério", body: "A maioria dos fornecedores vende para pessoa física, com CPF. Dá para começar com menos de R$100 e sem pedido mínimo alto." },
      { layout: "text", title: "Margem de 100% a 400%", body: "Comprando no atacado, cada produto pode ser revendido por 2x a 4x o valor. É assim que se constrói uma renda extra de verdade." },
      { layout: "cta", headline: "Quer comprar onde as lojas compram?", sub: "180 fornecedores verificados + 6 bônus, prontos para você começar hoje." },
    ],
  },
  {
    folder: "02-perdendo-dinheiro-varejo",
    slides: [
      { layout: "hook", eyebrow: "PARE DE PERDER DINHEIRO", lines: [{ t: "Você está" }, { t: "perdendo grana" }, { t: "no varejo.", hl: true }], sub: "Comprando caro pra revender barato. Isso acaba agora." },
      { layout: "text", title: "Pague o preço de fábrica", body: "Quem compra no varejo paga o lucro de 3 ou 4 intermediários. No atacado você compra direto da fonte e fica com toda a margem." },
      { layout: "text", title: "O mesmo produto, metade do preço", body: "Aquele item que você revende? Existe um fornecedor vendendo ele bem mais barato. Você só precisa do contato certo." },
      { layout: "text", title: "Lucro que sobra no seu bolso", body: "Comprando certo, cada venda rende muito mais. É a diferença entre vender por vender e realmente fazer uma renda." },
      { layout: "cta", headline: "Comece a comprar do jeito certo", sub: "Acesse 180 fornecedores do atacado testados e aprovados." },
    ],
  },
  {
    folder: "03-comecar-com-100",
    slides: [
      { layout: "hook", eyebrow: "RENDA EXTRA", lines: [{ t: "Dá pra revender" }, { t: "começando com" }, { t: "menos de R$100.", hl: true }], sub: "Sem CNPJ, sem experiência, do seu celular." },
      { layout: "text", title: "Não precisa de muito dinheiro", body: "Esqueça a ideia de que precisa investir milhares. A maioria dos fornecedores aceita pedidos pequenos, perfeitos pra quem está começando." },
      { layout: "text", title: "Teste antes de escalar", body: "Compre pouco, venda, e reinvista o lucro. É assim que se cresce sem risco e sem dívida." },
      { layout: "text", title: "Tudo do seu celular", body: "Você acha o fornecedor, anuncia no Instagram, WhatsApp ou Shopee e vende. Simples assim." },
      { layout: "cta", headline: "Comece sua renda extra hoje", sub: "180 fornecedores na palma da mão por menos do que um lanche." },
    ],
  },
  {
    folder: "04-5-erros-revenda",
    slides: [
      { layout: "hook", eyebrow: "ATENÇÃO REVENDEDORA", lines: [{ t: "5 erros que te" }, { t: "impedem de" }, { t: "lucrar.", hl: true }], sub: "O nº 3 quase todo mundo comete sem perceber." },
      { layout: "text", n: "1", title: "Comprar no varejo", body: "Revender o que você comprou caro mata sua margem. Compre no atacado, direto do fornecedor.", theme: "dark" },
      { layout: "text", n: "2", title: "Não pesquisar fornecedor", body: "Cair no primeiro que aparece é receita pra golpe e preço ruim. Use fornecedores verificados.", theme: "dark" },
      { layout: "text", n: "3", title: "Errar o preço de venda", body: "Vender sem calcular taxa e frete = trabalhar de graça. Precifique certo desde o início.", theme: "dark" },
      { layout: "text", n: "4", title: "Achar que precisa de CNPJ", body: "A maioria dos fornecedores vende pra CPF. Você pode começar como pessoa física hoje.", theme: "dark" },
      { layout: "text", n: "5", title: "Ficar só na teoria", body: "Esperar o momento perfeito é o erro mais caro. Quem age primeiro, vende primeiro.", theme: "dark" },
      { layout: "cta", headline: "Evite os erros e comece certo", sub: "Lista com 180 fornecedores verificados + guia de precificação." },
    ],
  },
  {
    folder: "05-lista-escondida",
    slides: [
      { layout: "hook", eyebrow: "QUASE NINGUÉM CONTA", lines: [{ t: "Existe uma lista" }, { t: "que revendedores" }, { t: "escondem.", hl: true }], sub: "Os fornecedores que abastecem as lojas que você admira." },
      { layout: "text", title: "Por que escondem?", body: "Quem achou o fornecedor certo não quer concorrência. Por isso a informação fica guardada a sete chaves." },
      { layout: "text", title: "A fonte por trás das lojas", body: "Aquelas lojas de Instagram que vendem o dia todo? Elas compram dos mesmos fornecedores que você pode acessar." },
      { layout: "text", title: "Informação é vantagem", body: "Quando você sabe de onde comprar, o jogo vira. Você compra barato, vende com margem e cresce." },
      { layout: "cta", headline: "Acesse a lista completa", sub: "180 fornecedores direto da fonte. A vantagem que faltava." },
    ],
  },
  {
    folder: "06-mitos-cnpj",
    slides: [
      { layout: "hook", eyebrow: "MITOS DA REVENDA", lines: [{ t: "\"Precisa de" }, { t: "CNPJ pra" }, { t: "revender?\"", hl: true }], sub: "Não. E mais 3 mentiras que te travam." },
      { layout: "text", title: "Mito 1: precisa de CNPJ", body: "Verdade: a maioria dos fornecedores vende pra pessoa física, com CPF. Dá pra começar hoje.", theme: "cream" },
      { layout: "text", title: "Mito 2: precisa de muito dinheiro", body: "Verdade: com menos de R$100 você já faz seu primeiro pedido e testa o mercado.", theme: "cream" },
      { layout: "text", title: "Mito 3: o mercado tá saturado", body: "Verdade: todo dia milhões compram online. Espaço é o que não falta pra quem compra certo.", theme: "cream" },
      { layout: "cta", headline: "Pare de se travar e comece", sub: "180 fornecedores prontos pra você, sem CNPJ e sem burocracia." },
    ],
  },
  {
    folder: "07-o-que-vender-cada-mes",
    slides: [
      { layout: "hook", eyebrow: "CALENDÁRIO DE VENDAS", lines: [{ t: "O que vender" }, { t: "em cada mês", hl: true }, { t: "pra lucrar mais." }], sub: "Produto certo, na hora certa = mais venda." },
      { layout: "text", title: "Maio: Dia das Mães", body: "Perfumes, cosméticos, joias e moda feminina disparam. É a 2ª maior data do ano." },
      { layout: "text", title: "Outubro: Dia das Crianças", body: "Brinquedos e games explodem. Pais e avós compram, e o ticket médio sobe." },
      { layout: "text", title: "Novembro e Dezembro", body: "Black Friday e Natal: o melhor período do ano. Quem se prepara antes, fatura muito." },
      { layout: "cta", headline: "Saiba o que vender o ano todo", sub: "Lista de fornecedores + calendário de sazonalidade completo." },
    ],
  },
  {
    folder: "08-quanto-da-pra-lucrar",
    slides: [
      { layout: "hook", eyebrow: "FAÇA AS CONTAS", lines: [{ t: "Quanto dá pra" }, { t: "lucrar", hl: true }, { t: "revendendo?" }], sub: "Os números vão te surpreender." },
      { layout: "text", title: "Comprou por R$20", body: "Um produto no atacado por R$20 pode ser revendido por R$50 a R$80, dependendo do nicho." },
      { layout: "text", title: "Vendeu por R$60", body: "Isso é R$40 de lucro em UMA venda. Faça 10 por semana e veja o resultado no fim do mês." },
      { layout: "text", title: "Margem de 100% a 400%", body: "Não é exagero: comprando direto do fornecedor, essa é a margem real de quem revende certo." },
      { layout: "cta", headline: "Comece a fazer esses números", sub: "180 fornecedores com margem de verdade esperando por você." },
    ],
  },
  {
    folder: "09-passo-a-passo",
    slides: [
      { layout: "hook", eyebrow: "PASSO A PASSO", lines: [{ t: "Do fornecedor" }, { t: "à 1ª venda", hl: true }, { t: "em 4 passos." }], sub: "Salva esse post pra não esquecer." },
      { layout: "text", n: "1", title: "Escolha seu nicho", body: "Roupas, beleza, acessórios? Comece pelo que você já gosta e entende.", theme: "dark" },
      { layout: "text", n: "2", title: "Ache o fornecedor", body: "Acesse a lista, escolha um fornecedor verificado e faça contato direto.", theme: "dark" },
      { layout: "text", n: "3", title: "Anuncie e venda", body: "Tire boas fotos, anuncie no Instagram, WhatsApp ou Shopee e comece a vender.", theme: "dark" },
      { layout: "text", n: "4", title: "Reinvista e cresça", body: "Use o lucro pra comprar mais e escalar. É assim que vira um negócio de verdade.", theme: "dark" },
      { layout: "cta", headline: "Dê o primeiro passo agora", sub: "A lista de fornecedores que faltava pra você começar." },
    ],
  },
  {
    folder: "10-mais-vendidos",
    slides: [
      { layout: "hook", eyebrow: "TENDÊNCIA AGORA", lines: [{ t: "Os produtos" }, { t: "que mais vendem", hl: true }, { t: "na Shopee e ML." }], sub: "E onde achar fornecedor pra cada um." },
      { layout: "text", title: "Beleza e cuidados", body: "Maquiagem, skincare e perfumes têm procura o ano todo e recompra garantida." },
      { layout: "text", title: "Acessórios de celular", body: "Capinhas, fones e carregadores: custo baixo, margem altíssima e demanda infinita." },
      { layout: "text", title: "Moda e fitness", body: "Roupas, conjuntos e moda fitness vendem todo dia, em qualquer plataforma." },
      { layout: "cta", headline: "Acesse os fornecedores certos", sub: "180 fornecedores das categorias que mais vendem hoje." },
    ],
  },
];

(async () => {
  const base = path.join("social", "carrosseis");
  fs.mkdirSync(base, { recursive: true });
  let total = 0;
  for (const c of carrosseis) {
    const dir = path.join(base, c.folder);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < c.slides.length; i++) {
      const svg = render(c.slides[i]);
      await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(path.join(dir, `slide-${i + 1}.jpg`));
      total++;
    }
    console.log("ok:", c.folder, "(" + c.slides.length + " slides)");
  }
  console.log("TOTAL:", total, "imagens em", base);
})();
