const sharp = require("sharp");
const F = "Arial, Helvetica, sans-serif";
const W = 1080, H = 820;
const trust = [
  ["🔒", "Pagamento seguro", "Ambiente criptografado"],
  ["⚡", "Acesso imediato", "Entregue no seu e-mail"],
  ["🛡️", "7 dias de garantia", "Devolução sem burocracia"],
];
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fff7ed"/>
  <rect x="0" y="0" width="${W}" height="12" fill="#ea580c"/>

  <text x="540" y="130" font-family="${F}" font-size="54" font-weight="900" fill="#111" text-anchor="middle">Falta pouco!</text>
  <text x="540" y="195" font-family="${F}" font-size="54" font-weight="900" fill="#111" text-anchor="middle">Seu acesso é liberado</text>
  <text x="540" y="260" font-family="${F}" font-size="54" font-weight="900" fill="#ea580c" text-anchor="middle">na hora após o pagamento</text>

  <text x="540" y="330" font-family="${F}" font-size="32" fill="#555" text-anchor="middle">180 fornecedores do atacado + 6 bônus</text>

  <rect x="190" y="375" width="700" height="86" rx="16" fill="#16a34a"/>
  <text x="540" y="430" font-family="${F}" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">✓ Compra 100% segura e protegida</text>

  <g font-family="${F}">
    ${trust.map((t, i) => {
      const y = 560 + i * 110;
      return `
        <circle cx="290" cy="${y - 10}" r="32" fill="#ffffff" stroke="#fed7aa" stroke-width="2"/>
        <text x="290" y="${y}" font-size="32" text-anchor="middle">${t[0]}</text>
        <text x="350" y="${y - 8}" font-size="34" font-weight="800" fill="#111">${t[1]}</text>
        <text x="350" y="${y + 26}" font-size="24" fill="#6b7280">${t[2]}</text>`;
    }).join("")}
  </g>
</svg>`;
sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile("order-bumps/capas/banner-checkout-mobile.jpg").then(()=>console.log("banner mobile salvo"));
