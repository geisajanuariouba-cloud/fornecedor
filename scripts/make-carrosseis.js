const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const F = "Arial, Helvetica, sans-serif";
const W = 1080, H = 1350;
const ORANGE = "#ea580c", LIGHT = "#f4f4f2", DARK = "#0d0d0d", MUTED_D = "rgba(255,255,255,0.6)", MUTED_L = "#6b7280";

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

// Linha de título com caixa de destaque opcional (estilo das referências)
function hlLine(line, x, y, fs, theme) {
  const t = line.t, hl = !!line.hl;
  const upper = t === t.toUpperCase();
  const charW = fs * (upper ? 0.62 : 0.55);
  const w = Math.round(t.length * charW);
  const padX = Math.round(fs * 0.15);
  let s = "";
  let fill;
  if (hl) {
    const boxFill = theme === "orange" ? DARK : ORANGE;
    s += `<rect x="${x - padX}" y="${Math.round(y - fs * 0.82)}" width="${w + padX * 2}" height="${Math.round(fs * 1.02)}" fill="${boxFill}"/>`;
    fill = "#ffffff";
  } else {
    fill = theme === "light" ? "#111111" : "#ffffff";
  }
  s += `<text x="${x}" y="${y}" font-family="${F}" font-size="${fs}" font-weight="900" fill="${fill}">${esc(t)}</text>`;
  return s;
}

function titleBlock(lines, x, startY, fs, lh, theme) {
  return lines.map((l, i) => hlLine(l, x, startY + i * lh, fs, theme)).join("");
}

function footer(theme) {
  const c = theme === "light" ? "#111111" : "#ffffff";
  const sub = theme === "light" ? MUTED_L : MUTED_D;
  return `<text x="80" y="${H - 70}" font-family="${F}" font-size="28" font-weight="800" fill="${c}">@fornecedorvip <tspan font-weight="400" fill="${sub}">· fornecedorvip.shop</tspan></text>`;
}

function swipe(theme) {
  const c = theme === "light" ? "#111111" : "#ffffff";
  return `<text x="${W - 80}" y="${H - 70}" font-family="${F}" font-size="28" font-weight="900" fill="${ORANGE}" text-anchor="end">Arrasta →</text>` +
    `<rect x="${W - 80}" y="0" width="0" height="0" fill="${c}"/>`;
}

function bg(theme) {
  if (theme === "orange") return `<rect width="${W}" height="${H}" fill="${ORANGE}"/>`;
  if (theme === "light") return `<rect width="${W}" height="${H}" fill="${LIGHT}"/>`;
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0a0a0a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
}

// ---------- LAYOUTS ----------
function slideHook({ eyebrow, lines, sub }) {
  const theme = "dark";
  const fs = 96, lh = 104;
  const startY = 470;
  const subLines = sub ? wrap(sub, 40) : [];
  const subY = startY + lines.length * lh + 60;
  const ew = Math.round(esc(eyebrow).length * 17) + 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${bg(theme)}
    <rect x="80" y="150" width="${ew}" height="56" rx="28" fill="none" stroke="#ffffff" stroke-width="2"/>
    <text x="${80 + ew / 2}" y="187" font-family="${F}" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${esc(eyebrow)}</text>
    ${titleBlock(lines, 80, startY, fs, lh, theme)}
    ${subLines.map((l, i) => `<text x="80" y="${subY + i * 50}" font-family="${F}" font-size="36" fill="${MUTED_D}">${esc(l)}</text>`).join("")}
    <text x="80" y="${H - 70}" font-family="${F}" font-size="30" font-weight="900" fill="${ORANGE}">@fornecedorvip</text>
    <text x="${W - 80}" y="${H - 70}" font-family="${F}" font-size="30" font-weight="900" fill="#ffffff" text-anchor="end">Arrasta →</text>
  </svg>`;
}

function slideContent({ n, lines, body, theme }) {
  const titleFs = 74, titleLh = 84;
  let startY, numSvg = "";
  if (n) {
    numSvg = `<text x="76" y="370" font-family="${F}" font-size="200" font-weight="900" fill="${ORANGE}">${esc(n)}</text>`;
    startY = 500;
  } else {
    numSvg = `<rect x="80" y="245" width="90" height="12" rx="6" fill="${ORANGE}"/>`;
    startY = 360;
  }
  const bodyColor = theme === "light" ? "#444" : "rgba(255,255,255,0.8)";
  const bodyLines = wrap(body, 38);
  const bodyY = startY + lines.length * titleLh + 55;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${bg(theme)}
    ${numSvg}
    ${titleBlock(lines, 80, startY, titleFs, titleLh, theme)}
    ${bodyLines.map((l, i) => `<text x="80" y="${bodyY + i * 56}" font-family="${F}" font-size="38" fill="${bodyColor}">${esc(l)}</text>`).join("")}
    ${footer(theme)}
  </svg>`;
}

function slideCTA({ lines, sub }) {
  const theme = "orange";
  const fs = 80, lh = 90;
  const startY = 300;
  const subLines = sub ? wrap(sub, 38) : [];
  const subY = startY + lines.length * lh + 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${bg(theme)}
    ${titleBlock(lines, 80, startY, fs, lh, theme)}
    ${subLines.map((l, i) => `<text x="80" y="${subY + i * 50}" font-family="${F}" font-size="36" fill="rgba(255,255,255,0.92)">${esc(l)}</text>`).join("")}
    <rect x="80" y="880" width="920" height="220" rx="20" fill="#ffffff"/>
    <text x="540" y="955" font-family="${F}" font-size="34" fill="#9ca3af" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>
    <text x="540" y="1050" font-family="${F}" font-size="100" font-weight="900" fill="${ORANGE}" text-anchor="middle">R$9,90</text>
    <text x="540" y="1190" font-family="${F}" font-size="42" font-weight="900" fill="#ffffff" text-anchor="middle">👉 LINK NA BIO</text>
    <text x="540" y="1245" font-family="${F}" font-size="30" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle">fornecedorvip.shop</text>
  </svg>`;
}

function render(def) {
  if (def.layout === "hook") return slideHook(def);
  if (def.layout === "cta") return slideCTA(def);
  return slideContent(def);
}

// helper p/ títulos: L(texto) normal, H(texto) destacado
const L = (t) => ({ t });
const HL = (t) => ({ t, hl: true });

const carrosseis = [
  {
    folder: "01-lojas-nao-pagam",
    slides: [
      { layout: "hook", eyebrow: "REVENDA INTELIGENTE", lines: [L("As lojas NÃO"), L("pagam o que"), HL("você paga.")], sub: "Elas compram direto da fonte. E você também pode." },
      { layout: "content", lines: [L("O segredo"), HL("é simples")], body: "Lojas compram no atacado, direto do fornecedor. Por isso vendem barato e ainda lucram. A diferença entre você e elas é só uma: saber ONDE comprar." },
      { layout: "content", lines: [L("Sem CNPJ,"), HL("sem mistério")], body: "A maioria dos fornecedores vende para pessoa física, com CPF. Dá para começar com menos de R$100 e sem pedido mínimo alto." },
      { layout: "content", lines: [L("Margem de"), HL("100% a 400%")], body: "Comprando no atacado, cada produto pode ser revendido por 2x a 4x o valor. É assim que se constrói uma renda extra de verdade." },
      { layout: "cta", lines: [L("Compre onde"), L("as lojas"), HL("compram.")], sub: "180 fornecedores verificados + 6 bônus, prontos pra você começar hoje." },
    ],
  },
  {
    folder: "02-perdendo-dinheiro-varejo",
    slides: [
      { layout: "hook", eyebrow: "PARE DE PERDER DINHEIRO", lines: [L("Você está"), L("perdendo grana"), HL("no varejo.")], sub: "Comprando caro pra revender barato. Isso acaba agora." },
      { layout: "content", lines: [L("Pague o preço"), HL("de fábrica")], body: "Quem compra no varejo paga o lucro de 3 ou 4 intermediários. No atacado você compra direto da fonte e fica com toda a margem." },
      { layout: "content", lines: [L("Mesmo produto,"), HL("metade do preço")], body: "Aquele item que você revende? Existe um fornecedor vendendo ele bem mais barato. Você só precisa do contato certo." },
      { layout: "content", lines: [L("Lucro que sobra"), HL("no seu bolso")], body: "Comprando certo, cada venda rende muito mais. É a diferença entre vender por vender e realmente fazer uma renda." },
      { layout: "cta", lines: [L("Compre do"), HL("jeito certo.")], sub: "Acesse 180 fornecedores do atacado testados e aprovados." },
    ],
  },
  {
    folder: "03-comecar-com-100",
    slides: [
      { layout: "hook", eyebrow: "RENDA EXTRA", lines: [L("Dá pra revender"), L("começando com"), HL("menos de R$100")], sub: "Sem CNPJ, sem experiência, do seu celular." },
      { layout: "content", lines: [L("Não precisa de"), HL("muito dinheiro")], body: "Esqueça a ideia de investir milhares. A maioria dos fornecedores aceita pedidos pequenos, perfeitos pra quem está começando." },
      { layout: "content", lines: [L("Teste antes"), HL("de escalar")], body: "Compre pouco, venda, e reinvista o lucro. É assim que se cresce sem risco e sem dívida." },
      { layout: "content", lines: [L("Tudo do"), HL("seu celular")], body: "Você acha o fornecedor, anuncia no Instagram, WhatsApp ou Shopee e vende. Simples assim." },
      { layout: "cta", lines: [L("Comece sua"), HL("renda extra.")], sub: "180 fornecedores na palma da mão por menos do que um lanche." },
    ],
  },
  {
    folder: "04-5-erros-revenda",
    slides: [
      { layout: "hook", eyebrow: "ATENÇÃO REVENDEDORA", lines: [L("5 erros que te"), L("impedem de"), HL("lucrar.")], sub: "O nº 3 quase todo mundo comete sem perceber." },
      { layout: "content", n: "01", lines: [L("Comprar no varejo")], body: "Revender o que você comprou caro mata sua margem. Compre no atacado, direto do fornecedor.", theme: "dark" },
      { layout: "content", n: "02", lines: [L("Não pesquisar"), L("fornecedor")], body: "Cair no primeiro que aparece é receita pra golpe e preço ruim. Use fornecedores verificados.", theme: "light" },
      { layout: "content", n: "03", lines: [L("Errar o preço")], body: "Vender sem calcular taxa e frete é trabalhar de graça. Precifique certo desde o início.", theme: "dark" },
      { layout: "content", n: "04", lines: [L("Achar que"), L("precisa de CNPJ")], body: "A maioria dos fornecedores vende pra CPF. Você pode começar como pessoa física hoje.", theme: "light" },
      { layout: "content", n: "05", lines: [L("Ficar só"), L("na teoria")], body: "Esperar o momento perfeito é o erro mais caro. Quem age primeiro, vende primeiro.", theme: "dark" },
      { layout: "cta", lines: [L("Evite os erros"), HL("e comece certo.")], sub: "180 fornecedores verificados + guia de precificação." },
    ],
  },
  {
    folder: "05-lista-escondida",
    slides: [
      { layout: "hook", eyebrow: "QUASE NINGUÉM CONTA", lines: [L("Existe uma lista"), L("que revendedores"), HL("escondem.")], sub: "Os fornecedores que abastecem as lojas que você admira." },
      { layout: "content", lines: [L("Por que"), HL("escondem?")], body: "Quem achou o fornecedor certo não quer concorrência. Por isso a informação fica guardada a sete chaves." },
      { layout: "content", lines: [L("A fonte por trás"), HL("das lojas")], body: "Aquelas lojas de Instagram que vendem o dia todo? Elas compram dos mesmos fornecedores que você pode acessar." },
      { layout: "content", lines: [L("Informação"), HL("é vantagem")], body: "Quando você sabe de onde comprar, o jogo vira. Você compra barato, vende com margem e cresce." },
      { layout: "cta", lines: [L("Acesse a"), HL("lista completa.")], sub: "180 fornecedores direto da fonte. A vantagem que faltava." },
    ],
  },
  {
    folder: "06-mitos-cnpj",
    slides: [
      { layout: "hook", eyebrow: "MITOS DA REVENDA", lines: [L("Precisa de"), L("CNPJ pra"), HL("revender?")], sub: "Não. E mais 2 mentiras que te travam." },
      { layout: "content", n: "01", lines: [L("Precisa de CNPJ")], body: "MITO. A maioria dos fornecedores vende pra pessoa física, com CPF. Dá pra começar hoje.", theme: "dark" },
      { layout: "content", n: "02", lines: [L("Precisa de"), L("muito dinheiro")], body: "MITO. Com menos de R$100 você já faz seu primeiro pedido e testa o mercado.", theme: "light" },
      { layout: "content", n: "03", lines: [L("O mercado"), L("tá saturado")], body: "MITO. Todo dia milhões compram online. Espaço é o que não falta pra quem compra certo.", theme: "dark" },
      { layout: "cta", lines: [L("Pare de se"), HL("travar.")], sub: "180 fornecedores prontos pra você, sem CNPJ e sem burocracia." },
    ],
  },
  {
    folder: "07-o-que-vender-cada-mes",
    slides: [
      { layout: "hook", eyebrow: "CALENDÁRIO DE VENDAS", lines: [L("O que vender"), HL("em cada mês"), L("pra lucrar.")], sub: "Produto certo, na hora certa = mais venda." },
      { layout: "content", lines: [L("Maio:"), HL("Dia das Mães")], body: "Perfumes, cosméticos, joias e moda feminina disparam. É a 2ª maior data do ano." },
      { layout: "content", lines: [L("Outubro:"), HL("Dia das Crianças")], body: "Brinquedos e games explodem. Pais e avós compram, e o ticket médio sobe." },
      { layout: "content", lines: [L("Nov e Dez:"), HL("Black Friday + Natal")], body: "O melhor período do ano. Quem prepara o estoque antes, fatura muito mais." },
      { layout: "cta", lines: [L("Saiba o que"), L("vender o"), HL("ano todo.")], sub: "Lista de fornecedores + calendário de sazonalidade completo." },
    ],
  },
  {
    folder: "08-quanto-da-pra-lucrar",
    slides: [
      { layout: "hook", eyebrow: "FAÇA AS CONTAS", lines: [L("Quanto dá"), L("pra lucrar"), HL("revendendo?")], sub: "Os números vão te surpreender." },
      { layout: "content", lines: [L("Comprou por"), HL("R$20")], body: "Um produto no atacado por R$20 pode ser revendido por R$50 a R$80, dependendo do nicho." },
      { layout: "content", lines: [L("Vendeu por"), HL("R$60")], body: "Isso é R$40 de lucro em UMA venda. Faça 10 por semana e veja o resultado no fim do mês." },
      { layout: "content", lines: [L("Margem de"), HL("100% a 400%")], body: "Não é exagero: comprando direto do fornecedor, essa é a margem real de quem revende certo." },
      { layout: "cta", lines: [L("Comece a fazer"), HL("esses números.")], sub: "180 fornecedores com margem de verdade esperando por você." },
    ],
  },
  {
    folder: "09-passo-a-passo",
    slides: [
      { layout: "hook", eyebrow: "PASSO A PASSO", lines: [L("Do fornecedor"), L("à 1ª venda"), HL("em 4 passos.")], sub: "Salva esse post pra não esquecer." },
      { layout: "content", n: "01", lines: [L("Escolha"), L("seu nicho")], body: "Roupas, beleza, acessórios? Comece pelo que você já gosta e entende.", theme: "dark" },
      { layout: "content", n: "02", lines: [L("Ache o"), L("fornecedor")], body: "Acesse a lista, escolha um fornecedor verificado e faça contato direto.", theme: "light" },
      { layout: "content", n: "03", lines: [L("Anuncie"), L("e venda")], body: "Tire boas fotos, anuncie no Instagram, WhatsApp ou Shopee e comece a vender.", theme: "dark" },
      { layout: "content", n: "04", lines: [L("Reinvista"), L("e cresça")], body: "Use o lucro pra comprar mais e escalar. É assim que vira um negócio de verdade.", theme: "light" },
      { layout: "cta", lines: [L("Dê o primeiro"), HL("passo agora.")], sub: "A lista de fornecedores que faltava pra você começar." },
    ],
  },
  {
    folder: "10-mais-vendidos",
    slides: [
      { layout: "hook", eyebrow: "TENDÊNCIA AGORA", lines: [L("Os produtos"), HL("que mais vendem"), L("na Shopee e ML.")], sub: "E onde achar fornecedor pra cada um." },
      { layout: "content", lines: [L("Beleza"), HL("e cuidados")], body: "Maquiagem, skincare e perfumes têm procura o ano todo e recompra garantida." },
      { layout: "content", lines: [L("Acessórios"), HL("de celular")], body: "Capinhas, fones e carregadores: custo baixo, margem altíssima e demanda infinita." },
      { layout: "content", lines: [L("Moda"), HL("e fitness")], body: "Roupas, conjuntos e moda fitness vendem todo dia, em qualquer plataforma." },
      { layout: "cta", lines: [L("Acesse os"), L("fornecedores"), HL("certos.")], sub: "180 fornecedores das categorias que mais vendem hoje." },
    ],
  },
];

(async () => {
  const base = path.join("social", "carrosseis");
  // limpa e recria
  fs.rmSync(base, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  let total = 0;
  for (const c of carrosseis) {
    const dir = path.join(base, c.folder);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < c.slides.length; i++) {
      await sharp(Buffer.from(render(c.slides[i]))).jpeg({ quality: 90 }).toFile(path.join(dir, `slide-${i + 1}.jpg`));
      total++;
    }
    console.log("ok:", c.folder, "(" + c.slides.length + ")");
  }
  console.log("TOTAL:", total);
})();
