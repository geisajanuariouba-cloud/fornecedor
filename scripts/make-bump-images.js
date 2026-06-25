const sharp = require("sharp");
const fs = require("fs");

fs.mkdirSync("order-bumps", { recursive: true });

const FONT = "Arial, Helvetica, sans-serif";

// ───────────────────────── MOCKUP 1: PLANILHA
const planilha = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#f3f4f6"/>
  <!-- janela -->
  <rect x="30" y="34" width="540" height="332" rx="14" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.5"/>
  <!-- barra topo -->
  <rect x="30" y="34" width="540" height="44" rx="14" fill="#166534"/>
  <rect x="30" y="60" width="540" height="18" fill="#166534"/>
  <circle cx="52" cy="56" r="5" fill="#ffffff" opacity="0.6"/>
  <circle cx="70" cy="56" r="5" fill="#ffffff" opacity="0.6"/>
  <circle cx="88" cy="56" r="5" fill="#ffffff" opacity="0.6"/>
  <text x="300" y="62" font-family="${FONT}" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">Planilha de Precificação e Controle</text>

  <!-- cabeçalho tabela -->
  <g font-family="${FONT}" font-size="11" font-weight="800" fill="#ffffff">
    <rect x="54" y="96" width="150" height="28" fill="#166534"/>
    <rect x="206" y="96" width="78" height="28" fill="#166534"/>
    <rect x="286" y="96" width="78" height="28" fill="#166534"/>
    <rect x="366" y="96" width="86" height="28" fill="#166534"/>
    <rect x="454" y="96" width="92" height="28" fill="#166534"/>
    <text x="62" y="114">Produto</text>
    <text x="214" y="114">Custo</text>
    <text x="294" y="114">Taxa</text>
    <text x="374" y="114">Preço</text>
    <text x="462" y="114">Lucro</text>
  </g>

  <!-- linhas -->
  <g font-family="${FONT}" font-size="11" fill="#333">
    ${[
      ["Conjunto fitness", "R$22", "20%", "R$60", "R$18"],
      ["Perfume 50ml", "R$35", "16%", "R$84", "R$29"],
      ["Kit maquiagem", "R$28", "20%", "R$70", "R$21"],
      ["Bolsa transversal", "R$30", "20%", "R$75", "R$23"],
    ].map((row, i) => {
      const y = 124 + i * 30;
      const bg = i % 2 ? "#f9fafb" : "#ffffff";
      return `
        <rect x="54" y="${y}" width="492" height="30" fill="${bg}"/>
        <text x="62" y="${y + 19}" font-weight="600">${row[0]}</text>
        <text x="214" y="${y + 19}">${row[1]}</text>
        <text x="294" y="${y + 19}">${row[2]}</text>
        <text x="374" y="${y + 19}" font-weight="700" fill="#15803d">${row[3]}</text>
        <text x="462" y="${y + 19}" font-weight="800" fill="#15803d">${row[4]}</text>`;
    }).join("")}
  </g>

  <!-- rodapé resumo -->
  <rect x="54" y="248" width="492" height="34" rx="6" fill="#fff7ed" stroke="#fed7aa"/>
  <text x="64" y="270" font-family="${FONT}" font-size="11.5" font-weight="700" fill="#7c2d12">Lucro total do mês</text>
  <text x="536" y="270" font-family="${FONT}" font-size="14" font-weight="900" fill="#ea580c" text-anchor="end">R$ 1.480,00</text>

  <!-- selo -->
  <rect x="54" y="298" width="120" height="26" rx="13" fill="#ea580c"/>
  <text x="114" y="315" font-family="${FONT}" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">EXCEL EDITÁVEL</text>
  <text x="546" y="316" font-family="${FONT}" font-size="13" font-weight="900" fill="#ea580c" text-anchor="end">Fornecedor<tspan fill="#111">Vip</tspan></text>
</svg>`;

// ───────────────────────── MOCKUP 2: CALENDÁRIO
// [mês, data curta, mês forte?]
const meses = [
  ["JAN", "Volta às aulas", false], ["FEV", "Carnaval", false], ["MAR", "Dia da Mulher", false], ["ABR", "Páscoa", false],
  ["MAI", "Dia das Mães", true], ["JUN", "Namorados", true], ["JUL", "Inverno", false], ["AGO", "Dia dos Pais", false],
  ["SET", "Nichos", false], ["OUT", "Dia das Crianças", false], ["NOV", "Black Friday", true], ["DEZ", "Natal", true],
];
const calendario = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a0800"/><stop offset="100%" stop-color="#0f0f0f"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg)"/>
  <rect x="0" y="0" width="600" height="8" fill="#ea580c"/>

  <text x="300" y="56" font-family="${FONT}" font-size="13" font-weight="800" fill="#ea580c" text-anchor="middle" letter-spacing="2">CALENDÁRIO DA REVENDEDORA</text>
  <text x="300" y="90" font-family="${FONT}" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">Produtos por Sazonalidade</text>
  <text x="300" y="113" font-family="${FONT}" font-size="12.5" fill="rgba(255,255,255,0.6)" text-anchor="middle">O que vender em cada mês para faturar o ano todo</text>

  <!-- grade de meses -->
  <g>
    ${meses.map((m, i) => {
      const col = i % 4, rowi = Math.floor(i / 4);
      const x = 50 + col * 126, y = 138 + rowi * 72;
      const strong = m[2];
      const cardFill = strong ? "#ea580c" : "#ffffff";
      const cardOp = strong ? "1" : "0.07";
      const stroke = strong ? "#ea580c" : "#ea580c";
      const strokeOp = strong ? "1" : "0.45";
      const monthColor = "#ffffff";
      const dateColor = strong ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)";
      return `
        <rect x="${x}" y="${y}" width="114" height="60" rx="11" fill="${cardFill}" opacity="${cardOp}"/>
        <rect x="${x}" y="${y}" width="114" height="60" rx="11" fill="none" stroke="${stroke}" stroke-width="1.3" opacity="${strokeOp}"/>
        <text x="${x + 14}" y="${y + 28}" font-family="${FONT}" font-size="17" font-weight="900" fill="${monthColor}">${m[0]}</text>
        <text x="${x + 14}" y="${y + 46}" font-family="${FONT}" font-size="9.5" font-weight="700" fill="${dateColor}">${m[1].toUpperCase()}</text>
        ${strong ? `<text x="${x + 100}" y="${y + 18}" font-family="${FONT}" font-size="13" font-weight="900" fill="#ffffff" text-anchor="end">★</text>` : ""}`;
    }).join("")}
  </g>

  <text x="300" y="378" font-family="${FONT}" font-size="12.5" font-weight="800" fill="#ea580c" text-anchor="middle">Fornecedor<tspan fill="#ffffff">Vip</tspan>  ·  ★ = os meses que mais faturam no ano</text>
</svg>`;

(async () => {
  await sharp(Buffer.from(planilha)).png().toFile("order-bumps/mockup-planilha.png");
  await sharp(Buffer.from(calendario)).png().toFile("order-bumps/mockup-calendario.png");
  console.log("imagens salvas em order-bumps/");
})();
