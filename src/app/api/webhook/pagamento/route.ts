import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 60;

function readPdf(filename: string) {
  const filePath = path.join(process.cwd(), "private", "pdfs", filename);
  return fs.readFileSync(filePath);
}

type ProductKind = "planilha" | "calendario" | "main";
function detectProduct(name: string): ProductKind {
  const n = (name || "").toLowerCase();
  if (n.includes("planilha")) return "planilha";
  if (n.includes("sazonal") || n.includes("calend")) return "calendario";
  return "main";
}

const BUMP = {
  planilha: {
    file: "Planilha-Controle-e-Precificacao.xlsx",
    label: "Planilha de Precificação e Controle",
    desc: "a <strong>Planilha de Precificação e Controle</strong> (Excel editável)",
    descTxt: "a Planilha de Precificação e Controle (Excel editável)",
    comoUsar: "Abra a planilha no Excel ou no Google Planilhas. Preencha apenas as células em amarelo (custo, taxa e margem) e ela calcula automaticamente o preço de venda ideal e o lucro de cada produto. Use também as abas de controle de estoque, vendas e o resumo financeiro.",
  },
  calendario: {
    file: "Lista-Produtos-por-Sazonalidade.pdf",
    label: "Calendário de Produtos por Sazonalidade",
    desc: "o <strong>Calendário de Produtos por Sazonalidade</strong> (PDF)",
    descTxt: "o Calendário de Produtos por Sazonalidade (PDF)",
    comoUsar: "No PDF você encontra, mês a mês, o que mais vende em cada época do ano, com a margem média, o nível de demanda, em quais plataformas vender e quando comprar do fornecedor para chegar na frente. Comece pelo calendário do próximo mês e planeje suas compras com antecedência.",
  },
} as const;

function deepFind(obj: unknown, keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (keys.includes(k.toLowerCase()) && typeof v === "string" && v.trim()) {
      return v.trim();
    }
  }
  for (const v of Object.values(obj as Record<string, unknown>)) {
    if (v && typeof v === "object") {
      const found = deepFind(v, keys);
      if (found) return found;
    }
  }
  return undefined;
}

// Status aceitos — inclui variações do Mercado Pago (PIX), Zyro e Wiapy
const APPROVED_STATUSES = [
  "paid", "approved", "completed", "accredited",
  "order_approved", "payment_approved", "payment_confirmed",
  "aprovado", "pago", "confirmado", "venda_aprovada",
  "pix_received", "authorized",
];

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const order = (body?.data ?? body) as Record<string, unknown>;

    const customer = (order?.customer ?? order?.buyer ?? order?.payer ?? {}) as Record<string, unknown>;
    const payment = (order?.payment ?? order?.transaction ?? {}) as Record<string, unknown>;
    const checkout = (order?.checkout ?? {}) as Record<string, unknown>;

    // Busca email em múltiplos campos comuns de gateways diferentes
    const email = String(
      customer?.email ??
      deepFind(body, ["email", "buyer_email", "payer_email", "customer_email", "user_email"]) ?? ""
    ).toLowerCase().trim();

    const name = String(
      customer?.name ?? customer?.full_name ??
      deepFind(body, ["full_name", "name", "buyer_name", "payer_name", "customer_name"]) ?? "Cliente"
    );

    const rawStatus = String(
      payment?.status ?? order?.status ??
      deepFind(body, ["order_status", "status", "payment_status", "webhook_event_type", "event", "type"]) ?? "unknown"
    ).toLowerCase();

    const titles: string[] = [];
    if (Array.isArray(order?.products)) {
      for (const p of order.products as Array<Record<string, unknown>>) {
        if (p?.title) titles.push(String(p.title));
        if (p?.name) titles.push(String(p.name));
      }
    }
    if (titles.length === 0) {
      if (checkout?.title) titles.push(String(checkout.title));
      if (Array.isArray(checkout?.orderbump)) {
        for (const ob of checkout.orderbump as Array<Record<string, unknown>>) {
          if (ob?.title) titles.push(String(ob.title));
        }
      }
    }
    if (titles.length === 0) {
      const pn = deepFind(body, ["product_name", "item_title", "description"]);
      if (pn) titles.push(pn);
    }
    const kinds = Array.from(new Set(titles.map(detectProduct)));
    if (kinds.length === 0) kinds.push("main");

    let cents = Number(payment?.amount ?? order?.amount ?? 0);
    if (!cents) {
      cents += Number(checkout?.amount ?? 0);
      if (Array.isArray(checkout?.orderbump)) {
        for (const ob of checkout.orderbump as Array<Record<string, unknown>>) {
          cents += Number(ob?.amount ?? 0);
        }
      }
    }
    const value = cents > 0 ? cents / 100 : 9.9;

    const isApproval = APPROVED_STATUSES.some((s) => rawStatus.includes(s));

    console.log("[webhook/pagamento] received", {
      email: email || "(empty)",
      status: rawStatus,
      kinds,
      value,
      isApproval,
    });

    if (!email || !isApproval) {
      return NextResponse.json({
        ok: true,
        handled: false,
        reason: !email ? "no_email" : "not_approved",
        status: rawStatus,
      });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ua = req.headers.get("user-agent") ?? "";

    after(async () => {
      // Dispara Purchase via CAPI
      try {
        await sendCapiPurchase({ email, value, ip, ua });
        console.log("[webhook/pagamento] capi purchase enviado para", email);
      } catch (e) {
        console.error("[webhook/pagamento] falha no capi purchase:", e);
      }

      // Envia emails
      for (const kind of kinds) {
        try {
          if (kind === "main") await sendDeliveryEmail(email, name);
          else await sendBumpEmail(email, name, kind);
          console.log("[webhook/pagamento] email enviado:", kind, "->", email);
        } catch (e) {
          console.error("[webhook/pagamento] falha no envio de email:", kind, e);
        }
      }
    });

    return NextResponse.json({ ok: true, queued: true, kinds });
  } catch (e) {
    console.error("[webhook/pagamento]", e);
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

async function sendCapiPurchase({ email, value, ip, ua }: { email: string; value: number; ip: string; ua: string }) {
  const PIXEL_ID = "1274073178133799";
  const token = process.env.META_CAPI_TOKEN ?? "";
  if (!token) { console.warn("[webhook/pagamento] META_CAPI_TOKEN não definido, pulando CAPI"); return; }

  const hashedEmail = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.toLowerCase().trim()))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join(""));

  const payload = {
    data: [{
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: "https://fornecedorvip.shop",
      user_data: {
        em: [hashedEmail],
        ...(ip ? { client_ip_address: ip } : {}),
        ...(ua ? { client_user_agent: ua } : {}),
      },
      custom_data: {
        currency: "BRL",
        value,
        content_name: "Lista de Fornecedores VIP",
        content_category: "Digital Product",
      },
    }],
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  console.log("[webhook/pagamento] capi purchase ok:", data?.events_received);
}

async function sendDeliveryEmail(email: string, name: string) {
  const attachments = [
    { filename: "Lista-Fornecedores-VIP.pdf", content: readPdf("lista-fornecedores.pdf") },
    { filename: "Bônus 01 - Guia Loja de 10.pdf", content: readPdf("bonus-01-guia-loja-de-10.pdf") },
    { filename: "Bônus 02 - Produtos Mais Vendidos.pdf", content: readPdf("bonus-02-produtos-mais-vendidos.pdf") },
    { filename: "Bônus 03 - Pacote Influencer Instagram.pdf", content: readPdf("bonus-03-pacote-influencer-instagram.pdf") },
    { filename: "Bônus 04 - Catálogo de Tendências.pdf", content: readPdf("bonus-04-catalogo-tendencias.pdf") },
    { filename: "Bônus 05 - Imagens com IA.pdf", content: readPdf("bonus-05-imagens-com-ia.pdf") },
    { filename: "Bônus 06 - Grupos WhatsApp.pdf", content: readPdf("bonus-06-grupos-whatsapp.pdf") },
  ];

  const firstName = name.split(" ")[0] || name;

  const text = `Olá, ${firstName}!

Seu pagamento foi confirmado. Já anexei neste email a Lista de Fornecedores VIP e os 6 bônus (todos em PDF).

Para acompanhar novidades e falar direto com fornecedores, entre nos grupos:

- Grupo VIP Revendedores: https://chat.whatsapp.com/IQiT9q9pC1CIe06TXwUEIy
- Canal BossStore Vencedor: https://whatsapp.com/channel/0029Vb7gouR5q08XX9EtgW24
- Canal João Cleber JC Atacado: https://whatsapp.com/channel/0029Vb74Fd7BPzjUsaXWlC0l
- Grupo Exclusivo: https://chat.whatsapp.com/DGtBNPpdJYpFvcP0ADJmGq

Qualquer dúvida, é só responder este e-mail ou falar com o nosso suporte:
- E-mail: contato@fornecedorvip.shop
- WhatsApp: (32) 99842-5801

Abraço,
Equipe FornecedorVip
fornecedorvip.shop`;

  const sendResult = await resend.emails.send({
    from: "Equipe FornecedorVip <contato@fornecedorvip.shop>",
    to: email,
    replyTo: "contato@fornecedorvip.shop",
    subject: `${firstName}, seu acesso à Lista de Fornecedores`,
    text,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222;font-size:15px;line-height:1.6;">
        <p>Olá, ${firstName}!</p>
        <p>Seu pagamento foi confirmado. Já anexei neste email a <strong>Lista de Fornecedores VIP</strong> e os <strong>6 bônus</strong> (todos em PDF).</p>
        <p>Para acompanhar novidades e falar direto com fornecedores, entre nos grupos:</p>
        <p>
          • <a href="https://chat.whatsapp.com/IQiT9q9pC1CIe06TXwUEIy">Grupo VIP Revendedores</a><br/>
          • <a href="https://whatsapp.com/channel/0029Vb7gouR5q08XX9EtgW24">Canal BossStore Vencedor</a><br/>
          • <a href="https://whatsapp.com/channel/0029Vb74Fd7BPzjUsaXWlC0l">Canal João Cleber JC Atacado</a><br/>
          • <a href="https://chat.whatsapp.com/DGtBNPpdJYpFvcP0ADJmGq">Grupo Exclusivo</a>
        </p>
        <p>Qualquer dúvida, é só responder este e-mail ou falar com o nosso suporte:</p>
        <p>
          ✉️ E-mail: <a href="mailto:contato@fornecedorvip.shop">contato@fornecedorvip.shop</a><br/>
          💬 WhatsApp: <a href="https://wa.me/5532998425801">(32) 99842-5801</a>
        </p>
        <p>Abraço,<br/>Equipe FornecedorVip<br/>
        <span style="color:#9ca3af;font-size:13px;">fornecedorvip.shop</span></p>
      </div>
    `,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (sendResult.error) {
    throw new Error(JSON.stringify(sendResult.error));
  }
  console.log("[webhook/pagamento] resend id=", sendResult.data?.id);
}

async function sendBumpEmail(email: string, name: string, kind: "planilha" | "calendario") {
  const b = BUMP[kind];
  const firstName = name.split(" ")[0] || name;

  const text = `Olá, ${firstName}!

Obrigado pela sua compra. Seu pagamento foi confirmado e o seu material já está em anexo neste e-mail: ${b.descTxt}.

Como usar:
${b.comoUsar}

Qualquer dúvida, é só responder este e-mail ou falar com o nosso suporte:
- E-mail: contato@fornecedorvip.shop
- WhatsApp: (32) 99842-5801

Bons negócios e boas vendas!

Abraço,
Equipe FornecedorVip
fornecedorvip.shop`;

  const sendResult = await resend.emails.send({
    from: "Equipe FornecedorVip <contato@fornecedorvip.shop>",
    to: email,
    replyTo: "contato@fornecedorvip.shop",
    subject: `${firstName}, aqui está o seu material: ${b.label}`,
    text,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222;font-size:15px;line-height:1.7;">
        <p>Olá, ${firstName}!</p>
        <p>Obrigado pela sua compra. Seu pagamento foi confirmado e o seu material já está <strong>em anexo neste e-mail</strong>: ${b.desc}.</p>
        <p><strong>Como usar:</strong><br/>${b.comoUsar}</p>
        <p>Qualquer dúvida, é só responder este e-mail ou falar com o nosso suporte:</p>
        <p>
          ✉️ E-mail: <a href="mailto:contato@fornecedorvip.shop">contato@fornecedorvip.shop</a><br/>
          💬 WhatsApp: <a href="https://wa.me/5532998425801">(32) 99842-5801</a>
        </p>
        <p>Bons negócios e boas vendas!</p>
        <p>Abraço,<br/>Equipe FornecedorVip<br/>
        <span style="color:#9ca3af;font-size:13px;">fornecedorvip.shop</span></p>
      </div>
    `,
    attachments: [{ filename: b.file, content: readPdf(b.file) }],
  });

  if (sendResult.error) {
    throw new Error(JSON.stringify(sendResult.error));
  }
  console.log("[webhook/pagamento] bump enviado:", kind, sendResult.data?.id);
}
