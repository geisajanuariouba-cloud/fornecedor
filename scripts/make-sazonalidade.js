const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(__dirname, "../order-bumps");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; color: #111; }
  .page { width: 794px; min-height: 1123px; padding: 44px 52px; position: relative; page-break-after: always; }
  .orange { color: #ea580c; }
  .tag { display: inline-block; background: #ea580c; color: #fff; font-size: 10px; font-weight: 800;
    letter-spacing: .1em; padding: 4px 13px; border-radius: 100px; margin-bottom: 10px; }
  .header { display: flex; align-items: center; justify-content: space-between;
    border-bottom: 3px solid #ea580c; padding-bottom: 14px; margin-bottom: 22px; }
  .logo { font-size: 17px; font-weight: 900; }
  .logo span { color: #111; }
  .badge { font-size: 10px; font-weight: 700; color: #ea580c; border: 1.5px solid #ea580c; padding: 3px 10px; border-radius: 100px; }
  h1 { font-size: 28px; font-weight: 900; line-height: 1.2; margin-bottom: 8px; }
  p, li { font-size: 12.5px; line-height: 1.65; color: #333; }
  .footer { position: absolute; bottom: 26px; left: 52px; right: 52px; display: flex;
    justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 10px; }
  .footer span { font-size: 9.5px; color: #9ca3af; }
  .cover { background: linear-gradient(160deg,#1a0800,#0f0f0f); display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; min-height: 1123px; }
  .cover-emoji { font-size: 78px; margin-bottom: 22px; }
  .cover h1 { color: #fff; font-size: 36px; margin-bottom: 12px; }
  .cover .sub { color: rgba(255,255,255,.65); font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
  .cover .pill { background: #ea580c; color: #fff; font-size: 12px; font-weight: 800; padding: 8px 24px; border-radius: 100px; letter-spacing: .1em; }
  .cover .brand { color: #ea580c; font-weight: 900; font-size: 18px; margin-top: 46px; }
  .highlight { background: #ea580c; color: #fff; border-radius: 10px; padding: 13px 18px; margin: 16px 0; }
  .highlight p { color: #fff; font-weight: 700; }
  .tip { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px 14px; border-radius: 0 8px 8px 0; margin: 10px 0; }
  .tip p { color: #16a34a; font-weight: 600; font-size: 12px; }
  ul { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
  ul li { display: flex; gap: 9px; align-items: flex-start; font-size: 12.5px; }
  ul li::before { content: '✅'; flex-shrink: 0; }

  .mblock { border: 1.5px solid #fed7aa; border-radius: 14px; overflow: hidden; margin-bottom: 18px; }
  .mtop { background: #fff7ed; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
  .mtop .ic { font-size: 30px; }
  .mtop .mt { font-size: 18px; font-weight: 900; color: #111; line-height: 1.1; }
  .mtop .md { font-size: 11px; color: #ea580c; font-weight: 700; }
  .dem { margin-left: auto; font-size: 10px; font-weight: 800; color: #fff; padding: 4px 11px; border-radius: 100px; white-space: nowrap; }
  .dem.alta { background: #f59e0b; } .dem.muito { background: #ea580c; } .dem.exp { background: #dc2626; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #166534; color: #fff; font-size: 10.5px; font-weight: 800; padding: 7px 10px; text-align: left; }
  td { font-size: 11px; padding: 7px 10px; border-bottom: 1px solid #f3f4f6; color: #333; vertical-align: top; }
  tr:nth-child(even) td { background: #f9fafb; }
  .buy { background: #fff; padding: 9px 16px; font-size: 11.5px; color: #7c2d12; border-top: 1px dashed #fed7aa; }
  .buy b { color: #ea580c; }
  .rank { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
  .rank .pos { font-size: 26px; font-weight: 900; color: #ea580c; min-width: 38px; }
  .rank .rt { font-size: 15px; font-weight: 900; }
  .rank .rd { font-size: 12px; color: #555; }
`;

const demClass = (d) => d === "Explosiva" ? "exp" : d === "Muito Alta" ? "muito" : "alta";

const months = [
  { ic: "🎒", mes: "JANEIRO", data: "Volta às aulas + Verão", buy: "Compre 30 a 40 dias antes (meados de dezembro). Material escolar esgota cedo.",
    rows: [
      ["Material escolar", "Cadernos, mochilas, estojos, canetas", "80–150%", "Muito Alta", "Shopee, ML"],
      ["Moda praia", "Biquínis, saídas, chinelos", "100–250%", "Alta", "Instagram, Shopee"],
      ["Acessórios de verão", "Óculos de sol, bonés, protetor solar", "100–200%", "Alta", "Shopee, ML"],
      ["Garrafas térmicas", "Squeeze, copos térmicos", "120–200%", "Alta", "Shopee, Instagram"],
    ], dem: "Muito Alta" },
  { ic: "🎭", mes: "FEVEREIRO", data: "Carnaval + pré-Namorados", buy: "Compre 25 a 30 dias antes (início de janeiro). Janela curta e intensa.",
    rows: [
      ["Fantasias e adereços", "Tiaras, perucas, máscaras, asas", "150–300%", "Muito Alta", "Shopee, Instagram"],
      ["Maquiagem de festa", "Glitter, batom, face paint", "100–250%", "Alta", "Instagram, Shopee"],
      ["Moda praia/verão", "Biquínis, óculos, chinelos", "100–200%", "Alta", "Instagram, Shopee"],
      ["Bijuterias neon", "Brincos, colares, pulseiras de festa", "150–300%", "Alta", "Instagram, WhatsApp"],
    ], dem: "Muito Alta" },
  { ic: "💜", mes: "MARÇO", data: "Dia da Mulher (08/03)", buy: "Compre 20 a 30 dias antes (meados de fevereiro).",
    rows: [
      ["Cosméticos e beleza", "Kits skincare, cremes, máscaras faciais", "80–200%", "Alta", "Instagram, Shopee"],
      ["Perfumes femininos", "Perfumes e body splash", "80–150%", "Alta", "Instagram, WhatsApp"],
      ["Acessórios e bijuterias", "Brincos, colares, anéis", "150–300%", "Alta", "Instagram, Shopee"],
      ["Moda feminina", "Blusas, vestidos, conjuntos", "100–200%", "Alta", "Shopee, Instagram"],
    ], dem: "Alta" },
  { ic: "🐰", mes: "ABRIL", data: "Páscoa", buy: "Compre 30 dias antes (início de março). Embalagens esgotam rápido.",
    rows: [
      ["Confeitaria e embalagens", "Forminhas, caixas, sacolas, colheres", "100–250%", "Muito Alta", "Shopee, WhatsApp"],
      ["Cestas e decoração", "Cestas, papel celofane, laços", "100–200%", "Alta", "WhatsApp, Instagram"],
      ["Brinquedos (presente)", "Pelúcias, kits infantis", "80–200%", "Alta", "Shopee, ML"],
      ["Itens temáticos", "Orelhas de coelho, enfeites", "150–300%", "Alta", "Shopee, Instagram"],
    ], dem: "Muito Alta" },
  { ic: "💐", mes: "MAIO", data: "★ Dia das Mães (2º domingo)", buy: "Compre 35 a 45 dias antes (início de abril). 2ª maior data do ano.",
    rows: [
      ["Perfumes femininos", "Perfumes importados e nacionais", "80–150%", "Explosiva", "Instagram, WhatsApp, Shopee"],
      ["Cosméticos e kits", "Kits skincare, maquiagem, cremes", "100–200%", "Muito Alta", "Instagram, Shopee"],
      ["Joias e semijoias", "Brincos, correntes, pulseiras", "150–300%", "Muito Alta", "Instagram, WhatsApp"],
      ["Bolsas e acessórios", "Bolsas, necessaires, carteiras", "100–200%", "Alta", "Shopee, Instagram"],
    ], dem: "Explosiva" },
  { ic: "❤️", mes: "JUNHO", data: "★ Namorados (12/06) + Festas Juninas", buy: "Compre 30 dias antes (meados de maio). Mês com duas oportunidades.",
    rows: [
      ["Presentes a dois", "Perfumes, kits para casais", "80–180%", "Muito Alta", "Instagram, WhatsApp"],
      ["Lingerie", "Conjuntos, camisolas", "120–250%", "Muito Alta", "Instagram, WhatsApp"],
      ["Moda e decoração junina", "Roupa caipira, bandeirinhas, chapéus", "100–300%", "Alta", "Shopee, Instagram"],
      ["Acessórios românticos", "Bijuterias, canecas personalizadas", "120–250%", "Alta", "Instagram, Shopee"],
    ], dem: "Muito Alta" },
  { ic: "🧥", mes: "JULHO", data: "Férias escolares + Inverno", buy: "Compre 30 a 40 dias antes (início de junho).",
    rows: [
      ["Moda inverno", "Casacos, blusas de frio, toucas", "100–200%", "Muito Alta", "Shopee, ML"],
      ["Cama e aconchego", "Cobertores, mantas, pantufas", "100–180%", "Alta", "Shopee, ML"],
      ["Brinquedos e jogos", "Jogos de tabuleiro, brinquedos", "80–200%", "Alta", "Shopee, ML"],
      ["Acessórios de frio", "Luvas, cachecóis, meias térmicas", "150–300%", "Alta", "Shopee, Instagram"],
    ], dem: "Muito Alta" },
  { ic: "👔", mes: "AGOSTO", data: "Dia dos Pais (2º domingo)", buy: "Compre 30 a 40 dias antes (início de julho). Ticket médio alto.",
    rows: [
      ["Perfumes masculinos", "Perfumes importados e nacionais", "80–150%", "Muito Alta", "Instagram, WhatsApp, Shopee"],
      ["Eletrônicos e acessórios", "Fones, smartwatch, carregadores", "50–150%", "Muito Alta", "ML, Shopee"],
      ["Carteiras, cintos, relógios", "Couro, relógios, óculos masculinos", "100–250%", "Alta", "Shopee, Instagram"],
      ["Fitness masculino", "Garrafas, camisetas dry, acessórios", "100–200%", "Alta", "Shopee, Instagram"],
    ], dem: "Muito Alta" },
  { ic: "🍃", mes: "SETEMBRO", data: "Baixa temporada + Dia do Cliente (15/09)", buy: "Compre conforme o giro. Foque em nichos de recompra e fidelização.",
    rows: [
      ["Beleza e skincare", "Cremes, séruns, maquiagem (recompra)", "80–200%", "Alta", "Instagram, Shopee"],
      ["Acessórios de celular", "Capinhas, fones, suportes", "150–400%", "Alta", "Shopee, ML"],
      ["Casa e organização", "Organizadores, utilidades", "80–180%", "Alta", "Shopee, ML"],
      ["Fitness e bem-estar", "Roupa fitness, faixas, garrafas", "100–200%", "Alta", "Shopee, Instagram"],
    ], dem: "Alta" },
  { ic: "🧸", mes: "OUTUBRO", data: "Dia das Crianças (12/10) + Halloween", buy: "Compre 30 a 40 dias antes (início de setembro).",
    rows: [
      ["Brinquedos", "Bonecas, carrinhos, pelúcias, kits", "80–200%", "Explosiva", "Shopee, ML"],
      ["Games e acessórios", "Controles, fones gamer, jogos", "50–150%", "Muito Alta", "ML, Shopee"],
      ["Papelaria criativa", "Material infantil, kits de arte", "100–250%", "Alta", "Shopee, Instagram"],
      ["Fantasias Halloween", "Fantasias, maquiagem, adereços", "150–300%", "Alta", "Shopee, Instagram"],
    ], dem: "Explosiva" },
  { ic: "🔥", mes: "NOVEMBRO", data: "★ BLACK FRIDAY (última sexta)", buy: "Compre 40 a 60 dias antes (set/início out). Estoque pesado — maior pico do ano.",
    rows: [
      ["Eletrônicos e acessórios", "Fones, smartwatch, gadgets", "40–150%", "Explosiva", "ML, Shopee"],
      ["Beleza e perfumes", "Kits, perfumes, maquiagem", "80–200%", "Muito Alta", "Instagram, Shopee"],
      ["Moda (todas)", "Roupas, calçados, acessórios", "100–250%", "Muito Alta", "Shopee, Instagram"],
      ["Casa e utilidades", "Organização, cozinha, decoração", "80–180%", "Alta", "Shopee, ML"],
    ], dem: "Explosiva" },
  { ic: "🎄", mes: "DEZEMBRO", data: "★ Natal + Ano Novo", buy: "Compre 40 a 50 dias antes (meados de outubro). Maior volume do ano inteiro.",
    rows: [
      ["Presentes em geral", "Perfumes, kits, bijuterias", "80–200%", "Explosiva", "Instagram, WhatsApp, Shopee"],
      ["Brinquedos", "Bonecas, jogos, pelúcias", "80–200%", "Muito Alta", "Shopee, ML"],
      ["Decoração natalina", "Enfeites, luzes, guirlandas", "100–250%", "Alta", "Shopee, WhatsApp"],
      ["Moda festa/branca", "Roupa de réveillon, acessórios", "100–250%", "Muito Alta", "Shopee, Instagram"],
    ], dem: "Explosiva" },
];

function monthBlock(m) {
  const rows = m.rows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("");
  return `<div class="mblock">
    <div class="mtop">
      <span class="ic">${m.ic}</span>
      <div><div class="mt">${m.mes}</div><div class="md">${m.data}</div></div>
      <span class="dem ${demClass(m.dem)}">DEMANDA ${m.dem.toUpperCase()}</span>
    </div>
    <table>
      <tr><th>Categoria</th><th>Exemplos de produtos</th><th>Margem</th><th>Demanda</th><th>Onde vende</th></tr>
      ${rows}
    </table>
    <div class="buy">📦 <b>Quando comprar:</b> ${m.buy}</div>
  </div>`;
}

function header(badge) {
  return `<div class="header"><div class="logo"><span style="color:#ea580c">FORNECEDOR</span><span>VIP</span></div><div class="badge">${badge}</div></div>`;
}
function footer(p, t) {
  return `<div class="footer"><span>Calendário de Produtos por Sazonalidade</span><span>FornecedorVip © 2026</span><span>Página ${p} de ${t}</span></div>`;
}

const TOTAL = 9;
const pages = [];

// CAPA
pages.push(`<div class="page cover">
  <div class="cover-emoji">📅</div>
  <div class="tag">GUIA EXCLUSIVO</div>
  <h1>CALENDÁRIO DE PRODUTOS<br>POR SAZONALIDADE</h1>
  <p class="sub">O que vender em cada mês do ano<br>para faturar o ano inteiro</p>
  <div class="pill">12 MESES • MARGEM • DEMANDA • PLATAFORMAS</div>
  <div class="brand">FORNECEDOR<span style="color:#fff">VIP</span></div>
</div>`);

// INTRO
pages.push(`<div class="page">
  ${header("COMO USAR")}
  <div class="tag">LEIA PRIMEIRO</div>
  <h1>Produto certo, <span class="orange">na hora certa</span></h1>
  <p style="margin:12px 0 16px">A diferença entre quem fatura o ano todo e quem vende só de vez em quando quase nunca é o preço — é o <b>timing</b>. Quem antecipa as datas compra mais barato, anuncia antes da concorrência e vende com margem maior.</p>
  <p style="margin-bottom:16px">Este calendário mostra, mês a mês: a data comercial, as categorias que mais vendem, exemplos de produtos, a <b>margem média</b>, o <b>nível de demanda</b>, <b>quando comprar do fornecedor</b> e <b>em quais plataformas</b> cada produto vende melhor.</p>
  <div class="highlight"><p>⏱️ Regra de ouro: compre do fornecedor de 30 a 45 dias ANTES da data. Quem compra em cima da hora paga mais caro e arrisca não receber a tempo.</p></div>
  <h1 style="font-size:18px;color:#ea580c;margin:22px 0 8px">Legenda de demanda</h1>
  <ul>
    <li><b>Alta</b> — vende bem, fluxo constante.</li>
    <li><b>Muito Alta</b> — pico sazonal forte, vale reforçar estoque.</li>
    <li><b>Explosiva</b> — as maiores datas do ano. Prepare estoque com semanas de antecedência.</li>
  </ul>
  <div class="tip"><p>💡 Use junto com sua Lista de Fornecedores VIP: escolha o produto da época aqui e encontre o fornecedor certo lá.</p></div>
  ${footer(2, TOTAL)}
</div>`);

// MESES — 2 por página (6 páginas, p3..p8)
for (let i = 0; i < months.length; i += 2) {
  const pageNum = 3 + i / 2;
  const tri = ["1º TRIMESTRE", "1º TRIMESTRE", "2º TRIMESTRE", "2º/3º TRIMESTRE", "3º TRIMESTRE", "4º TRIMESTRE"][i / 2];
  pages.push(`<div class="page">
    ${header(tri)}
    ${monthBlock(months[i])}
    ${months[i + 1] ? monthBlock(months[i + 1]) : ""}
    ${footer(pageNum, TOTAL)}
  </div>`);
}

// RANKING (p9)
const ranking = [
  ["1º", "DEZEMBRO — Natal e Ano Novo", "Maior volume do ano. Todo mundo compra presente e o ticket sobe. Vende em todas as categorias."],
  ["2º", "NOVEMBRO — Black Friday", "Pico de demanda com o cliente já decidido a comprar. Quem tem estoque e bom preço fatura muito."],
  ["3º", "MAIO — Dia das Mães", "Segunda maior data do varejo. Compra emocional, ticket alto, ótimo para kits."],
  ["4º", "JUNHO — Namorados + Festas Juninas", "Duas oportunidades no mesmo mês: presentes a dois e produtos temáticos."],
  ["5º", "OUTUBRO — Dia das Crianças", "Brinquedos e games disparam. Pais e avós compram, elevando o ticket médio."],
];
pages.push(`<div class="page">
  ${header("RANKING")}
  <div class="tag">OS MAIS LUCRATIVOS</div>
  <h1>Os 5 meses que mais <span class="orange">faturam no ano</span></h1>
  <p style="margin:12px 0 18px">Se você tem capital limitado, concentre seus esforços e estoque nestes meses. Eles sozinhos podem responder pela maior parte do seu faturamento anual.</p>
  ${ranking.map(r => `<div class="rank"><div class="pos">${r[0]}</div><div><div class="rt">${r[1]}</div><div class="rd">${r[2]}</div></div></div>`).join("")}
  <div class="highlight"><p>🎯 Estratégia: reserve capital ao longo do ano para comprar estoque pesado antes de Novembro e Dezembro. É quando o jogo é ganho.</p></div>
  <div class="tip"><p>📋 Combine este calendário com a Planilha de Controle + Precificação para saber exatamente quanto comprar e por quanto vender em cada época.</p></div>
  ${footer(9, TOTAL)}
</div>`);

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join("")}</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const out = path.join(OUT_DIR, "Lista-Produtos-por-Sazonalidade.pdf");
  await page.pdf({ path: out, width: "794px", height: "1123px", printBackground: true });
  await browser.close();
  console.log("salvo:", out);
})();
