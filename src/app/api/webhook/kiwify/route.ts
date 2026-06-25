import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);
const PIXEL_ID = "1274073178133799";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN ?? "";

// Permite que o envio em segundo plano tenha tempo de concluir
export const maxDuration = 60;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Evento Purchase via Conversions API (server-side) — o navegador não pode disparar pós-checkout
async function sendMetaPurchase(email: string, orderId: string, phone?: string) {
  if (!CAPI_TOKEN) {
    console.warn("[webhook/kiwify] META_CAPI_TOKEN ausente — Purchase não enviado");
    return;
  }
  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `purchase_${orderId}`,
        action_source: "website",
        event_source_url: "https://www.fornecedorvip.shop",
        user_data: {
          em: [sha256(email)],
          ...(phone ? { ph: [sha256(phone.replace(/\D/g, ""))] } : {}),
        },
        custom_data: {
          currency: "BRL",
          value: 9.9,
          content_name: "Lista de Fornecedores VIP",
          content_category: "Digital Product",
          order_id: orderId,
        },
      },
    ],
  };
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );
  const data = await res.json();
  console.log("[webhook/kiwify] Purchase enviado:", JSON.stringify(data));
}

function readPdf(filename: string) {
  const filePath = path.join(process.cwd(), "private", "pdfs", filename);
  return fs.readFileSync(filePath);
}

// Busca recursiva por uma chave em qualquer nível do payload (Kiwify aninha em order/Customer)
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

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (process.env.KIWIFY_WEBHOOK_TOKEN && token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // Kiwify aninha tudo em "order"/"Customer" — busca recursiva é à prova de formato
    const email = (deepFind(body, ["email"]) ?? "").toLowerCase().trim();
    const name = deepFind(body, ["full_name", "name"]) ?? "Cliente";
    const rawStatus = (
      deepFind(body, ["order_status", "status", "webhook_event_type", "event"]) ?? "unknown"
    ).toLowerCase();
    const orderId = deepFind(body, ["order_id", "order_ref", "id"]) ?? `order_${Date.now()}`;
    const phone = deepFind(body, ["mobile", "phone"]);

    const isApproval = ["paid", "approved", "completed", "order_approved"].some((s) =>
      rawStatus.includes(s)
    );

    console.log("[webhook/kiwify] received", {
      email: email || "(empty)",
      status: rawStatus,
      isApproval,
      body_keys: Object.keys(body || {}),
    });

    if (!email || !isApproval) {
      return NextResponse.json({
        ok: true,
        handled: false,
        reason: !email ? "no_email" : "not_approved",
        status: rawStatus,
      });
    }

    // Responde à Kiwify IMEDIATAMENTE; email + Purchase (Meta) rodam em segundo plano (evita timeout)
    after(async () => {
      try {
        await sendDeliveryEmail(email, name);
        console.log("[webhook/kiwify] email enviado em background para", email);
      } catch (e) {
        console.error("[webhook/kiwify] falha no envio de email:", e);
      }
      try {
        await sendMetaPurchase(email, orderId, phone);
      } catch (e) {
        console.error("[webhook/kiwify] falha no Purchase Meta:", e);
      }
    });

    return NextResponse.json({ ok: true, queued: true });
  } catch (e) {
    console.error("[webhook/kiwify]", e);
    return NextResponse.json({ ok: false, error: String(e) });
  }
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

Se tiver qualquer dúvida, é só responder este email.

Abraço,
Equipe FornecedorVip`;

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
          <p>Se tiver qualquer dúvida, é só responder este email.</p>
          <p>Abraço,<br/>Equipe FornecedorVip</p>
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
  console.log("[webhook/kiwify] resend id=", sendResult.data?.id);
}
