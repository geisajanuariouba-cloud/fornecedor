const sharp = require("sharp");
const F = "Arial, Helvetica, sans-serif";
const W = 1200, H = 200;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fff7ed"/>
  <rect x="0" y="0" width="${W}" height="6" fill="#ea580c"/>

  <!-- esquerda: reforço da oferta -->
  <text x="56" y="64" font-family="${F}" font-size="27" font-weight="900" fill="#111">Falta pouco! Seu acesso é liberado</text>
  <text x="56" y="98" font-family="${F}" font-size="27" font-weight="900" fill="#ea580c">na hora após o pagamento</text>
  <text x="56" y="132" font-family="${F}" font-size="17" fill="#555">180 fornecedores do atacado + 6 bônus exclusivos</text>

  <!-- selo -->
  <rect x="56" y="150" width="430" height="40" rx="10" fill="#16a34a"/>
  <text x="74" y="176" font-family="${F}" font-size="17" font-weight="800" fill="#fff">✓ Compra 100% segura e protegida</text>

  <!-- direita: trust -->
  <g font-family="${F}">
    ${[
      ["🔒", "Pagamento seguro", "Ambiente criptografado"],
      ["⚡", "Acesso imediato", "Entregue no seu e-mail"],
      ["🛡️", "7 dias de garantia", "Devolução sem burocracia"],
    ].map((t, i) => {
      const y = 62 + i * 50;
      return `
        <circle cx="800" cy="${y - 6}" r="17" fill="#ffffff" stroke="#fed7aa" stroke-width="1.3"/>
        <text x="800" y="${y}" font-size="17" text-anchor="middle">${t[0]}</text>
        <text x="832" y="${y - 4}" font-size="18" font-weight="800" fill="#111">${t[1]}</text>
        <text x="832" y="${y + 15}" font-size="13" fill="#6b7280">${t[2]}</text>`;
    }).join("")}
  </g>
</svg>`;
sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile("order-bumps/capas/banner-checkout.jpg").then(()=>console.log("banner salvo"));
