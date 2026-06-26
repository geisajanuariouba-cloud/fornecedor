const sharp = require("sharp");
const F = "Arial, Helvetica, sans-serif";
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%" stop-color="#1a0800"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect x="0" y="0" width="1080" height="14" fill="#ea580c"/>
  <text x="540" y="150" font-family="${F}" font-size="42" font-weight="900" fill="#ea580c" text-anchor="middle">Fornecedor<tspan fill="#fff">Vip</tspan></text>
  <text x="540" y="420" font-family="${F}" font-size="220" font-weight="900" fill="#ea580c" text-anchor="middle" letter-spacing="-6">180</text>
  <text x="540" y="530" font-family="${F}" font-size="92" font-weight="900" fill="#ffffff" text-anchor="middle">FORNECEDORES</text>
  <text x="540" y="610" font-family="${F}" font-size="58" font-weight="900" fill="#ffffff" text-anchor="middle">DIRETO DO ATACADO</text>
  <text x="540" y="690" font-family="${F}" font-size="36" fill="rgba(255,255,255,0.65)" text-anchor="middle">Sem CNPJ · + 6 bônus exclusivos</text>
  <rect x="340" y="780" width="400" height="180" rx="24" fill="#ea580c"/>
  <text x="540" y="855" font-family="${F}" font-size="32" fill="rgba(255,255,255,0.85)" text-anchor="middle" text-decoration="line-through">De R$397 por</text>
  <text x="540" y="930" font-family="${F}" font-size="80" font-weight="900" fill="#ffffff" text-anchor="middle">R$9,90</text>
  <text x="540" y="1030" font-family="${F}" font-size="30" font-weight="700" fill="rgba(255,255,255,0.5)" text-anchor="middle">fornecedorvip.shop</text>
</svg>`;
sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile("order-bumps/capas/thumb-principal.jpg").then(()=>console.log("thumb salvo"));
