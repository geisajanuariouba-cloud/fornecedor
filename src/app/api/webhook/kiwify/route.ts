import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// Permite que o envio em segundo plano tenha tempo de concluir
export const maxDuration = 60;

const WHATSAPP_LINKS = `
• Grupo VIP Revendedores: https://chat.whatsapp.com/IQiT9q9pC1CIe06TXwUEIy
• Canal BossStore Vencedor: https://whatsapp.com/channel/0029Vb7gouR5q08XX9EtgW24
• Canal João Cleber JC Atacado: https://whatsapp.com/channel/0029Vb74Fd7BPzjUsaXWlC0l
• Grupo Exclusivo: https://chat.whatsapp.com/DGtBNPpdJYpFvcP0ADJmGq
`.trim();

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

    // Responde à Kiwify IMEDIATAMENTE e envia o email em segundo plano (evita timeout)
    after(async () => {
      try {
        await sendDeliveryEmail(email, name);
        console.log("[webhook/kiwify] email enviado em background para", email);
      } catch (e) {
        console.error("[webhook/kiwify] falha no envio em background:", e);
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

  const sendResult = await resend.emails.send({
      from: "FornecedorVip <contato@fornecedorvip.shop>",
      to: email,
      subject: "✅ Seu acesso chegou — Lista de Fornecedores VIP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
          <div style="background:#ea580c;padding:24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">FornecedorVip</h1>
          </div>
          <div style="padding:32px 24px;">
            <h2 style="color:#111;">Olá, ${name}! 🎉</h2>
            <p style="font-size:16px;line-height:1.6;">
              Seu pagamento foi confirmado e aqui está tudo que você comprou, em anexo neste email.
            </p>

            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-weight:bold;color:#ea580c;">📦 O que você recebeu:</p>
              <ul style="margin:0;padding-left:20px;line-height:2;">
                <li>Lista de Fornecedores VIP (180 fornecedores)</li>
                <li>Bônus 01 — Guia Loja de 10</li>
                <li>Bônus 02 — Produtos Mais Vendidos</li>
                <li>Bônus 03 — Pacote Influencer Instagram</li>
                <li>Bônus 04 — Catálogo de Tendências</li>
                <li>Bônus 05 — Imagens com IA</li>
                <li>Bônus 06 — Grupos WhatsApp</li>
              </ul>
            </div>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 12px;font-weight:bold;color:#16a34a;">💬 Entre nos grupos agora:</p>
              <p style="margin:0;line-height:2.2;font-size:14px;">
                • <a href="https://chat.whatsapp.com/IQiT9q9pC1CIe06TXwUEIy" style="color:#16a34a;">Grupo VIP Revendedores</a><br/>
                • <a href="https://whatsapp.com/channel/0029Vb7gouR5q08XX9EtgW24" style="color:#16a34a;">Canal BossStore Vencedor</a><br/>
                • <a href="https://whatsapp.com/channel/0029Vb74Fd7BPzjUsaXWlC0l" style="color:#16a34a;">Canal João Cleber JC Atacado</a><br/>
                • <a href="https://chat.whatsapp.com/DGtBNPpdJYpFvcP0ADJmGq" style="color:#16a34a;">Grupo Exclusivo</a>
              </p>
            </div>

            <p style="font-size:14px;color:#666;">
              Qualquer dúvida, responda este email.<br/>
              Boas vendas! 🚀
            </p>
          </div>
          <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#999;">
            FornecedorVip — fornecedorvip.shop
          </div>
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
