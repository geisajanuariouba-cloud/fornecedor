const sharp = require("sharp");
const F = "Arial, Helvetica, sans-serif";
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="1280" height="320" fill="url(#bg)"/>
  <rect x="0" y="0" width="1280" height="6" fill="#ea580c"/>

  <!-- esquerda: reforço da oferta -->
  <text x="56" y="92" font-family="${F}" font-size="34" font-weight="900" fill="#111">Falta pouco! Seu acesso é liberado</text>
  <text x="56" y="134" font-family="${F}" font-size="34" font-weight="900" fill="#ea580c">na hora após o pagamento</text>
  <text x="56" y="182" font-family="${F}" font-size="22" fill="#555">180 fornecedores do atacado + 6 bônus exclusivos</text>

  <!-- selo lista -->
  <rect x="56" y="210" width="556" height="58" rx="12" fill="#16a34a"/>
  <text x="80" y="247" font-family="${F}" font-size="22" font-weight="800" fill="#fff">✓ Compra 100% segura e protegida</text>

  <!-- direita: trust -->
  <g font-family="${F}">
    ${[
      ["🔒", "Pagamento seguro", "Ambiente criptografado"],
      ["⚡", "Acesso imediato", "Entregue no seu e-mail"],
      ["🛡️", "7 dias de garantia", "Devolução sem burocracia"],
    ].map((t, i) => {
      const y = 90 + i * 70;
      return `
        <circle cx="800" cy="${y - 8}" r="22" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
        <text x="800" y="${y}" font-size="22" text-anchor="middle">${t[0]}</text>
        <text x="840" y="${y - 4}" font-size="22" font-weight="800" fill="#111">${t[1]}</text>
        <text x="840" y="${y + 20}" font-size="16" fill="#6b7280">${t[2]}</text>`;
    }).join("")}
  </g>
</svg>`;
sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile("order-bumps/capas/banner-checkout.jpg").then(()=>console.log("banner salvo"));
