const sharp = require("sharp");
const F = "Arial, Helvetica, sans-serif";
const W = 1480, H = 400;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fff7ed"/>
  <rect x="0" y="0" width="${W}" height="10" fill="#ea580c"/>

  <!-- esquerda: reforço da oferta -->
  <text x="80" y="135" font-family="${F}" font-size="44" font-weight="900" fill="#111">Falta pouco! Seu acesso é liberado</text>
  <text x="80" y="190" font-family="${F}" font-size="44" font-weight="900" fill="#ea580c">na hora após o pagamento</text>
  <text x="80" y="242" font-family="${F}" font-size="26" fill="#555">180 fornecedores do atacado + 6 bônus exclusivos</text>

  <!-- selo -->
  <rect x="80" y="280" width="640" height="68" rx="14" fill="#16a34a"/>
  <text x="108" y="324" font-family="${F}" font-size="26" font-weight="800" fill="#fff">✓ Compra 100% segura e protegida</text>

  <!-- direita: trust -->
  <g font-family="${F}">
    ${[
      ["🔒", "Pagamento seguro", "Ambiente criptografado"],
      ["⚡", "Acesso imediato", "Entregue no seu e-mail"],
      ["🛡️", "7 dias de garantia", "Devolução sem burocracia"],
    ].map((t, i) => {
      const y = 130 + i * 90;
      return `
        <circle cx="1010" cy="${y - 10}" r="26" fill="#ffffff" stroke="#fed7aa" stroke-width="1.5"/>
        <text x="1010" y="${y}" font-size="26" text-anchor="middle">${t[0]}</text>
        <text x="1060" y="${y - 6}" font-size="26" font-weight="800" fill="#111">${t[1]}</text>
        <text x="1060" y="${y + 22}" font-size="18" fill="#6b7280">${t[2]}</text>`;
    }).join("")}
  </g>
</svg>`;
sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile("order-bumps/capas/banner-checkout.jpg").then(()=>console.log("banner salvo"));
