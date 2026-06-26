const sharp = require("sharp");
const fs = require("fs");
fs.mkdirSync("order-bumps/capas", { recursive: true });

const F = "Arial, Helvetica, sans-serif";

// ───────── CAPA PRINCIPAL
const principal = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#1a0800"/><stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect x="0" y="0" width="1080" height="16" fill="#ea580c"/>

  <text x="80" y="180" font-family="${F}" font-size="44" font-weight="900" fill="#ea580c">Fornecedor<tspan fill="#fff">Vip</tspan></text>

  <text x="80" y="430" font-family="${F}" font-size="150" font-weight="900" fill="#ea580c" letter-spacing="-4">180</text>
  <text x="80" y="540" font-family="${F}" font-size="86" font-weight="900" fill="#ffffff">FORNECEDORES</text>
  <text x="80" y="630" font-family="${F}" font-size="64" font-weight="900" fill="#ffffff">DIRETO DO ATACADO</text>

  <text x="80" y="710" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">Sem CNPJ · Sem pedido mínimo</text>
  <text x="80" y="766" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">Comece com menos de R$100</text>

  <g font-family="${F}" font-size="40" fill="#ffffff">
    ${[
      "180 fornecedores verificados",
      "14 categorias de produtos",
      "Contato direto via WhatsApp",
      "+ 6 bônus exclusivos",
      "Acesso imediato no e-mail",
    ].map((t, i) => {
      const y = 880 + i * 95;
      return `<circle cx="100" cy="${y - 13}" r="10" fill="#22c55e"/><text x="140" y="${y}">${t}</text>`;
    }).join("")}
  </g>

  <rect x="80" y="1410" width="920" height="200" rx="24" fill="#ea580c"/>
  <text x="540" y="1490" font-family="${F}" font-size="36" fill="rgba(255,255,255,0.85)" text-anchor="middle" text-decoration="line-through">De R$397,00 por apenas</text>
  <text x="540" y="1575" font-family="${F}" font-size="86" font-weight="900" fill="#ffffff" text-anchor="middle">R$9,90</text>

  <text x="540" y="1790" font-family="${F}" font-size="34" font-weight="700" fill="rgba(255,255,255,0.55)" text-anchor="middle">fornecedorvip.shop</text>
</svg>`;

// ───────── CAPA PLANILHA
const planilha = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs><linearGradient id="bg2" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0%" stop-color="#052e16"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#bg2)"/>
  <rect x="0" y="0" width="1080" height="16" fill="#16a34a"/>
  <text x="80" y="180" font-family="${F}" font-size="44" font-weight="900" fill="#22c55e">Fornecedor<tspan fill="#fff">Vip</tspan></text>

  <rect x="80" y="300" width="280" height="64" rx="32" fill="#16a34a"/>
  <text x="220" y="343" font-family="${F}" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">EXCEL EDITÁVEL</text>

  <text x="80" y="540" font-family="${F}" font-size="92" font-weight="900" fill="#ffffff">Planilha de</text>
  <text x="80" y="640" font-family="${F}" font-size="92" font-weight="900" fill="#22c55e">Precificação</text>
  <text x="80" y="740" font-family="${F}" font-size="92" font-weight="900" fill="#ffffff">e Controle</text>

  <text x="80" y="850" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">Calcule o preço e o lucro de cada</text>
  <text x="80" y="905" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">produto automaticamente.</text>

  <g font-family="${F}" font-size="40" fill="#ffffff">
    ${[
      "Preço de venda ideal automático",
      "Controle de estoque e vendas",
      "Resumo financeiro do mês",
      "Avisa quando repor o estoque",
    ].map((t, i) => {
      const y = 1080 + i * 95;
      return `<circle cx="100" cy="${y - 13}" r="10" fill="#22c55e"/><text x="140" y="${y}">${t}</text>`;
    }).join("")}
  </g>
  <text x="540" y="1820" font-family="${F}" font-size="34" font-weight="700" fill="rgba(255,255,255,0.5)" text-anchor="middle">fornecedorvip.shop</text>
</svg>`;

// ───────── CAPA CALENDÁRIO
const calendario = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs><linearGradient id="bg3" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0%" stop-color="#1a0800"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#bg3)"/>
  <rect x="0" y="0" width="1080" height="16" fill="#ea580c"/>
  <text x="80" y="180" font-family="${F}" font-size="44" font-weight="900" fill="#ea580c">Fornecedor<tspan fill="#fff">Vip</tspan></text>

  <rect x="80" y="300" width="340" height="64" rx="32" fill="#ea580c"/>
  <text x="250" y="343" font-family="${F}" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">GUIA EM PDF · 12 MESES</text>

  <text x="80" y="540" font-family="${F}" font-size="92" font-weight="900" fill="#ffffff">Calendário de</text>
  <text x="80" y="640" font-family="${F}" font-size="92" font-weight="900" fill="#ea580c">Produtos por</text>
  <text x="80" y="740" font-family="${F}" font-size="92" font-weight="900" fill="#ffffff">Sazonalidade</text>

  <text x="80" y="850" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">O que vender em cada mês do ano</text>
  <text x="80" y="905" font-family="${F}" font-size="40" fill="rgba(255,255,255,0.7)">para faturar o ano inteiro.</text>

  <g font-family="${F}" font-size="40" fill="#ffffff">
    ${[
      "Datas comerciais mês a mês",
      "Margem e demanda de cada produto",
      "Quando comprar do fornecedor",
      "Ranking dos 5 meses + lucrativos",
    ].map((t, i) => {
      const y = 1080 + i * 95;
      return `<circle cx="100" cy="${y - 13}" r="10" fill="#ea580c"/><text x="140" y="${y}">${t}</text>`;
    }).join("")}
  </g>
  <text x="540" y="1820" font-family="${F}" font-size="34" font-weight="700" fill="rgba(255,255,255,0.5)" text-anchor="middle">fornecedorvip.shop</text>
</svg>`;

(async () => {
  await sharp(Buffer.from(principal)).jpeg({ quality: 86 }).toFile("order-bumps/capas/capa-principal.jpg");
  await sharp(Buffer.from(planilha)).jpeg({ quality: 86 }).toFile("order-bumps/capas/capa-planilha.jpg");
  await sharp(Buffer.from(calendario)).jpeg({ quality: 86 }).toFile("order-bumps/capas/capa-calendario.jpg");
  console.log("capas salvas em order-bumps/capas/");
})();
