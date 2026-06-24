const sharp = require("sharp");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="14" fill="#ea580c"/>

  <text x="80" y="130" font-family="Arial, sans-serif" font-size="40" font-weight="900" fill="#ea580c">Fornecedor<tspan fill="#111">Vip</tspan></text>

  <text x="80" y="250" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="#111">180 Fornecedores</text>
  <text x="80" y="335" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="#ea580c">Direto do Atacado</text>

  <text x="80" y="415" font-family="Arial, sans-serif" font-size="34" font-weight="500" fill="#555">Sem CNPJ • Sem pedido mínimo • Comece com menos de R$100</text>

  <rect x="80" y="470" width="430" height="78" rx="14" fill="#22c55e"/>
  <text x="295" y="520" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">QUERO ACESSAR AGORA</text>

  <text x="80" y="592" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#9ca3af">+5.000 revendedoras já compram direto da fonte</text>
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile("public/og.png")
  .then(() => console.log("og.png criado"));
