const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(__dirname, "../order-bumps");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
  .page { width: 794px; min-height: 1123px; padding: 48px 56px; position: relative; page-break-after: always; }
  .orange { color: #ea580c; }
  .tag { display: inline-block; background: #ea580c; color: #fff; font-size: 11px; font-weight: 800;
    letter-spacing: .1em; padding: 4px 14px; border-radius: 100px; margin-bottom: 10px; }
  .header { display: flex; align-items: center; justify-content: space-between;
    border-bottom: 3px solid #ea580c; padding-bottom: 16px; margin-bottom: 28px; }
  .logo { font-size: 18px; font-weight: 900; letter-spacing: -.5px; }
  .logo span { color: #111; }
  .badge { font-size: 10px; font-weight: 700; color: #ea580c; border: 1.5px solid #ea580c;
    padding: 3px 10px; border-radius: 100px; }
  h1 { font-size: 30px; font-weight: 900; line-height: 1.2; margin-bottom: 8px; }
  h2 { font-size: 18px; font-weight: 800; margin: 24px 0 10px; color: #ea580c; }
  h3 { font-size: 14px; font-weight: 800; margin-bottom: 6px; }
  p, li { font-size: 13px; line-height: 1.7; color: #333; }
  ul { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 7px; }
  ul li { display: flex; gap: 10px; align-items: flex-start; }
  ul li::before { content: '✅'; flex-shrink: 0; }
  .star-list li::before { content: '★'; color: #ea580c; flex-shrink: 0; }
  .card { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; }
  .card h3 { color: #ea580c; }
  .highlight { background: #ea580c; color: #fff; border-radius: 10px; padding: 14px 20px; margin: 18px 0; }
  .highlight p { color: #fff; font-weight: 700; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .footer { position: absolute; bottom: 30px; left: 56px; right: 56px;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #f3f4f6; padding-top: 12px; }
  .footer span { font-size: 10px; color: #9ca3af; }
  .cover { background: linear-gradient(160deg, #1a0800 0%, #0f0f0f 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; min-height: 1123px; }
  .cover-emoji { font-size: 80px; margin-bottom: 24px; }
  .cover h1 { color: #fff; font-size: 38px; margin-bottom: 12px; }
  .cover .sub { color: rgba(255,255,255,.65); font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
  .cover .pill { background: #ea580c; color: #fff; font-size: 12px; font-weight: 800;
    padding: 8px 24px; border-radius: 100px; letter-spacing: .1em; }
  .cover .brand { color: #ea580c; font-weight: 900; font-size: 18px; margin-top: 48px; }
  .table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  .table th { background: #ea580c; color: #fff; font-size: 11.5px; font-weight: 800;
    padding: 9px 11px; text-align: left; }
  .table td { font-size: 11.5px; padding: 8px 11px; border-bottom: 1px solid #f3f4f6; color: #333; vertical-align: top; }
  .table tr:nth-child(even) td { background: #fff7ed; }
  .tip { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 11px 16px;
    border-radius: 0 8px 8px 0; margin: 12px 0; }
  .tip p { color: #16a34a; font-weight: 600; }
  .warn { background: #fff7ed; border-left: 4px solid #ea580c; padding: 11px 16px;
    border-radius: 0 8px 8px 0; margin: 12px 0; }
  .warn p { font-weight: 600; }
  .month { display:flex; align-items:center; gap:10px; margin: 18px 0 8px; }
  .month .ic { font-size: 26px; }
  .month .mt { font-size: 17px; font-weight: 900; }
  .month .md { font-size: 11px; color:#ea580c; font-weight:700; }
  .prods { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0 4px; }
  .chip { background:#fff; border:1.5px solid #fed7aa; color:#7c2d12; font-size:11px; font-weight:600;
    padding:3px 10px; border-radius:100px; }
`;

function header(badge) {
  return `<div class="header">
    <div class="logo"><span style="color:#ea580c">FORNECEDOR</span><span>VIP</span></div>
    <div class="badge">${badge}</div>
  </div>`;
}
function footer(page, total) {
  return `<div class="footer">
    <span>Lista de Produtos por Sazonalidade</span>
    <span>FornecedorVip © 2026</span>
    <span>Página ${page} de ${total}</span>
  </div>`;
}

const TOTAL = 9;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>

<!-- CAPA -->
<div class="page cover">
  <div class="cover-emoji">📅</div>
  <div class="tag">GUIA EXCLUSIVO</div>
  <h1>LISTA DE PRODUTOS<br>POR SAZONALIDADE</h1>
  <p class="sub">O que vender em cada época do ano<br>para nunca ficar sem faturar</p>
  <div class="pill">CALENDÁRIO DA REVENDEDORA</div>
  <div class="brand">FORNECEDOR<span style="color:#fff">VIP</span></div>
</div>

<!-- P2 — INTRO -->
<div class="page">
  ${header("INTRODUÇÃO")}
  <div class="tag">POR QUE ISSO IMPORTA</div>
  <h1>Vender o produto certo <span class="orange">na hora certa</span></h1>
  <p style="margin:12px 0 18px">A diferença entre uma revendedora que fatura o ano todo e uma que vende só de vez em quando quase nunca é o preço — é o <b>timing</b>. Quem antecipa as datas compra do fornecedor mais barato, anuncia antes da concorrência e vende com margem maior, enquanto os outros ainda estão correndo atrás.</p>
  <p style="margin-bottom:18px">Este guia mostra, mês a mês, <b>o que mais vende no Brasil</b> e quando você deve comprar do fornecedor para chegar na frente. Use junto com a sua Lista de Fornecedores VIP: escolha o produto da época aqui e ache o fornecedor lá.</p>
  <div class="highlight"><p>⏱️ Regra de ouro: compre do fornecedor de 30 a 45 dias ANTES da data. Quem compra em cima da hora paga mais caro e corre risco de não receber a tempo.</p></div>
  <h2>Como usar este guia</h2>
  <ul>
    <li><b>Planeje o mês seguinte sempre no mês atual.</b> Em abril você já prepara o Dia das Mães de maio.</li>
    <li><b>Foque nas 4 datas mais fortes</b> (Dia das Mães, Dia dos Namorados, Black Friday e Natal). Elas sozinhas podem responder pela maior parte do seu faturamento.</li>
    <li><b>Teste com pouco e reforce o que vender.</b> Compre uma quantidade pequena, valide e só então aumente o pedido.</li>
  </ul>
  ${footer(2, TOTAL)}
</div>

<!-- P3 — VISÃO GERAL -->
<div class="page">
  ${header("VISÃO GERAL")}
  <div class="tag">CALENDÁRIO ANUAL</div>
  <h1>O ano inteiro <span class="orange">num olhar</span></h1>
  <p style="margin:10px 0 6px">A data comercial de cada mês e os produtos que mais saem. Os detalhes vêm nas próximas páginas.</p>
  <table class="table">
    <tr><th>Mês</th><th>Data comercial</th><th>Produtos que mais vendem</th></tr>
    <tr><td><b>Janeiro</b></td><td>Volta às aulas + Verão</td><td>Material escolar, mochilas, moda praia, protetor solar</td></tr>
    <tr><td><b>Fevereiro</b></td><td>Carnaval</td><td>Fantasias, glitter, adereços, biquínis, óculos</td></tr>
    <tr><td><b>Março</b></td><td>Dia do Consumidor (15/03)</td><td>Moda outono, eletrônicos, beleza (queima de estoque)</td></tr>
    <tr><td><b>Abril</b></td><td>Páscoa</td><td>Cestas, chocolates, decoração, embalagens, brinquedos</td></tr>
    <tr><td><b>Maio</b></td><td>★ Dia das Mães</td><td>Perfumes, cosméticos, joias, moda feminina, bolsas</td></tr>
    <tr><td><b>Junho</b></td><td>★ Namorados + Festa Junina</td><td>Perfumes, lingerie, presentes a dois, moda caipira</td></tr>
    <tr><td><b>Julho</b></td><td>Férias + Inverno</td><td>Moda inverno, cobertores, brinquedos, jogos</td></tr>
    <tr><td><b>Agosto</b></td><td>Dia dos Pais</td><td>Perfume masculino, eletrônicos, acessórios, carteiras</td></tr>
    <tr><td><b>Setembro</b></td><td>Primavera + Dia do Cliente</td><td>Moda leve, beleza, casa, jardinagem</td></tr>
    <tr><td><b>Outubro</b></td><td>Dia das Crianças</td><td>Brinquedos, games, papelaria, roupa infantil</td></tr>
    <tr><td><b>Novembro</b></td><td>★ BLACK FRIDAY</td><td>Eletrônicos, beleza, moda — TODAS as categorias</td></tr>
    <tr><td><b>Dezembro</b></td><td>★ Natal + Ano Novo</td><td>Presentes, decoração, brinquedos, perfumes, moda branca</td></tr>
  </table>
  <div class="tip"><p>★ = as 4 datas mais fortes do ano. Prepare estoque com semanas de antecedência.</p></div>
  ${footer(3, TOTAL)}
</div>

<!-- P4 — 1º TRIMESTRE -->
<div class="page">
  ${header("1º TRIMESTRE")}
  <div class="tag">JANEIRO • FEVEREIRO • MARÇO</div>
  <h1>Começa o ano <span class="orange">vendendo</span></h1>

  <div class="month"><span class="ic">🎒</span><div><div class="mt">JANEIRO</div><div class="md">VOLTA ÀS AULAS + VERÃO</div></div></div>
  <div class="prods">
    <span class="chip">Mochilas e estojos</span><span class="chip">Material escolar</span><span class="chip">Garrafas/squeeze</span>
    <span class="chip">Moda praia</span><span class="chip">Protetor solar</span><span class="chip">Óculos de sol</span><span class="chip">Chinelos</span>
  </div>
  <p>Dois mercados ao mesmo tempo: pais reequipando os filhos e o público de verão. Material escolar tem giro altíssimo e recompra. Moda praia e acessórios de verão vendem em todo o litoral e nas capitais quentes.</p>
  <div class="tip"><p>💰 Margem: material escolar 80%–150% • acessórios de praia 100%–250%.</p></div>

  <div class="month"><span class="ic">🎭</span><div><div class="mt">FEVEREIRO</div><div class="md">CARNAVAL</div></div></div>
  <div class="prods">
    <span class="chip">Fantasias</span><span class="chip">Adereços e tiaras</span><span class="chip">Glitter e maquiagem</span>
    <span class="chip">Biquínis e maiôs</span><span class="chip">Óculos divertidos</span><span class="chip">Bijuterias neon</span>
  </div>
  <p>Janela curta e intensa. Produtos de baixo custo e margem enorme. Comece a anunciar 3 semanas antes — a procura explode na semana do feriado.</p>

  <div class="month"><span class="ic">🛒</span><div><div class="mt">MARÇO</div><div class="md">DIA DO CONSUMIDOR (15/03)</div></div></div>
  <div class="prods">
    <span class="chip">Moda outono</span><span class="chip">Eletrônicos pequenos</span><span class="chip">Beleza</span><span class="chip">Casa e organização</span>
  </div>
  <p>A "Black Friday do 1º semestre". Ótimo para queimar estoque parado de verão com a desculpa da promoção e girar capital para o Dia das Mães.</p>
  ${footer(4, TOTAL)}
</div>

<!-- P5 — DIA DAS MÃES -->
<div class="page">
  ${header("DESTAQUE")}
  <div class="tag">★ MAIO — A MAIOR DO 1º SEMESTRE</div>
  <h1>Dia das <span class="orange">Mães</span></h1>
  <p style="margin:10px 0 14px">A segunda data que mais vende no varejo brasileiro, só atrás do Natal. O cliente está disposto a gastar mais porque é presente. Foque em produtos que "embrulham bem" e têm apelo emocional.</p>
  <div class="two-col">
    <div class="card"><h3>💐 Campeões de venda</h3><p>Perfumes femininos, kits de cosméticos, cremes, joias e semijoias, bolsas, necessaires, conjuntos de moda feminina.</p></div>
    <div class="card"><h3>🎁 O segredo do kit</h3><p>Monte kits prontos (ex: perfume + creme + necessaire). O ticket sobe e a margem aumenta sem o cliente comparar preço unitário.</p></div>
  </div>
  <h2>Calendário de execução</h2>
  <table class="table">
    <tr><th>Quando</th><th>O que fazer</th></tr>
    <tr><td>Início de abril</td><td>Comprar do fornecedor e montar os kits</td></tr>
    <tr><td>Meados de abril</td><td>Tirar fotos, criar anúncios, começar a divulgar</td></tr>
    <tr><td>Últimos 10 dias</td><td>Reforçar anúncios — é quando 70% compram</td></tr>
  </table>
  <div class="highlight"><p>🎯 Dica de ouro: ofereça "embrulho para presente" como diferencial. Custa centavos e fecha a venda contra a concorrência.</p></div>
  ${footer(5, TOTAL)}
</div>

<!-- P6 — 2º TRIMESTRE resto -->
<div class="page">
  ${header("MEIO DO ANO")}
  <div class="tag">JUNHO • JULHO • AGOSTO</div>
  <h1>O semestre <span class="orange">não para</span></h1>

  <div class="month"><span class="ic">❤️</span><div><div class="mt">JUNHO</div><div class="md">NAMORADOS (12/06) + FESTA JUNINA</div></div></div>
  <div class="prods">
    <span class="chip">Perfumes</span><span class="chip">Lingerie</span><span class="chip">Presentes a dois</span>
    <span class="chip">Moda caipira</span><span class="chip">Decoração junina</span><span class="chip">Acessórios</span>
  </div>
  <p>Mês duplo. Para os Namorados, presentes com apelo romântico (perfume, lingerie, kits). Para a Festa Junina, roupa temática e decoração — giro rápido e barato.</p>

  <div class="month"><span class="ic">🧥</span><div><div class="mt">JULHO</div><div class="md">FÉRIAS + INVERNO</div></div></div>
  <div class="prods">
    <span class="chip">Moda inverno</span><span class="chip">Cobertores e mantas</span><span class="chip">Toucas e luvas</span>
    <span class="chip">Brinquedos</span><span class="chip">Jogos e games</span>
  </div>
  <p>Crianças em casa = brinquedos e jogos vendem muito. Frio = moda e itens de aquecer. Bom mês para nichos de casa.</p>

  <div class="month"><span class="ic">👔</span><div><div class="mt">AGOSTO</div><div class="md">DIA DOS PAIS</div></div></div>
  <div class="prods">
    <span class="chip">Perfume masculino</span><span class="chip">Eletrônicos</span><span class="chip">Carteiras e cintos</span>
    <span class="chip">Relógios</span><span class="chip">Acessórios fitness</span>
  </div>
  <p>Ticket alto: público compra eletrônicos e perfumes importados de presente. Kits masculinos (perfume + necessaire) performam muito bem.</p>
  ${footer(6, TOTAL)}
</div>

<!-- P7 — 3º/4º início -->
<div class="page">
  ${header("RETA FINAL")}
  <div class="tag">SETEMBRO • OUTUBRO</div>
  <h1>Esquentando para o <span class="orange">fim de ano</span></h1>

  <div class="month"><span class="ic">🌷</span><div><div class="mt">SETEMBRO</div><div class="md">PRIMAVERA + DIA DO CLIENTE (15/09)</div></div></div>
  <div class="prods">
    <span class="chip">Moda leve/colorida</span><span class="chip">Beleza e skincare</span><span class="chip">Casa e organização</span><span class="chip">Jardinagem</span>
  </div>
  <p>Estação de renovação: o público compra moda nova e itens de beleza. Use o Dia do Cliente para fidelizar quem já comprou com você com um cupom de "obrigada".</p>

  <div class="month"><span class="ic">🧸</span><div><div class="mt">OUTUBRO</div><div class="md">DIA DAS CRIANÇAS (12/10)</div></div></div>
  <div class="prods">
    <span class="chip">Brinquedos</span><span class="chip">Games e controles</span><span class="chip">Pelúcias</span>
    <span class="chip">Papelaria criativa</span><span class="chip">Roupa infantil</span><span class="chip">Bonecas</span>
  </div>
  <p>Uma das maiores datas para brinquedos e games do ano. Pais e avós compram — ticket médio sobe. Comece a anunciar no fim de setembro.</p>
  <div class="tip"><p>💰 Margem: brinquedos 80%–200%. Importados de baixo custo dão margens ainda maiores.</p></div>
  ${footer(7, TOTAL)}
</div>

<!-- P8 — BLACK FRIDAY + NATAL -->
<div class="page">
  ${header("AS MAIORES DO ANO")}
  <div class="tag">★ NOVEMBRO • DEZEMBRO</div>
  <h1>O que define <span class="orange">o seu ano</span></h1>

  <div class="month"><span class="ic">🔥</span><div><div class="mt">NOVEMBRO</div><div class="md">BLACK FRIDAY (última sexta)</div></div></div>
  <div class="prods">
    <span class="chip">Eletrônicos</span><span class="chip">Beleza</span><span class="chip">Moda</span><span class="chip">Casa</span><span class="chip">Tudo com desconto</span>
  </div>
  <p>O maior dia de vendas do varejo. O cliente está com o cartão na mão procurando oferta. Estoque com antecedência, prepare anúncios e crie senso de urgência real (estoque limitado de verdade).</p>
  <div class="warn"><p>⚠️ Não invente desconto falso. Suba o preço antes e finja promoção destrói sua reputação. Compre barato do fornecedor para conseguir descontos reais.</p></div>

  <div class="month"><span class="ic">🎄</span><div><div class="mt">DEZEMBRO</div><div class="md">NATAL + ANO NOVO</div></div></div>
  <div class="prods">
    <span class="chip">Presentes em geral</span><span class="chip">Decoração natalina</span><span class="chip">Brinquedos</span>
    <span class="chip">Perfumes e kits</span><span class="chip">Moda branca (réveillon)</span><span class="chip">Bijuterias</span>
  </div>
  <p>O mês que mais vende no ano inteiro. Todo mundo compra presente. Depois do Natal, emenda com a moda branca e acessórios para o réveillon. Trabalhe com kits e embrulho.</p>
  <div class="highlight"><p>🎯 Novembro + Dezembro podem valer mais que vários meses somados. Reserve capital e estoque com antecedência para não perder venda por falta de produto.</p></div>
  ${footer(8, TOTAL)}
</div>

<!-- P9 — PRODUTOS O ANO TODO + FECHAMENTO -->
<div class="page">
  ${header("BÔNUS")}
  <div class="tag">SEM ESTAÇÃO</div>
  <h1>Produtos que vendem <span class="orange">o ano inteiro</span></h1>
  <p style="margin:10px 0 14px">Além das datas, mantenha sempre no catálogo produtos de procura constante. Eles garantem faturamento nos meses sem data comercial forte.</p>
  <div class="two-col">
    <div class="card"><h3>💪 Fitness & Bem-estar</h3><p>Roupa fitness, garrafas, suplementos, faixas elásticas. Procura alta o ano todo.</p></div>
    <div class="card"><h3>💄 Beleza</h3><p>Maquiagem, skincare, perfumes, acessórios de cabelo. Recompra frequente.</p></div>
    <div class="card"><h3>🏠 Casa & Organização</h3><p>Organizadores, utilidades, itens de cozinha. Ticket baixo, giro alto.</p></div>
    <div class="card"><h3>📱 Acessórios de celular</h3><p>Capinhas, fones, carregadores, suportes. Margem altíssima e demanda infinita.</p></div>
  </div>
  <h2>Resumo: as 4 regras de quem fatura o ano todo</h2>
  <ul class="star-list">
    <li>Compre do fornecedor 30–45 dias antes de cada data.</li>
    <li>Concentre energia nas 4 datas fortes (Mães, Namorados, Black Friday, Natal).</li>
    <li>Monte kits para subir o ticket e fugir da comparação de preço.</li>
    <li>Mantenha produtos "sem estação" girando nos meses fracos.</li>
  </ul>
  <div class="highlight"><p>📋 Use junto com sua Lista de Fornecedores VIP: escolha o produto da época aqui e encontre o fornecedor certo lá. É assim que se fatura o ano inteiro.</p></div>
  ${footer(9, TOTAL)}
</div>

</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const out = path.join(OUT_DIR, "Lista-Produtos-por-Sazonalidade.pdf");
  await page.pdf({ path: out, width: "794px", height: "1123px", printBackground: true });
  await browser.close();
  console.log("salvo:", out);
})();
