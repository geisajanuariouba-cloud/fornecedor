import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// Permite que o envio em segundo plano tenha tempo de concluir
export const maxDuration = 60;

// OBS: o evento Purchase NÃO é mais enviado daqui. A Wiapy dispara o Purchase
// pelo navegador + API de Conversões (mesmo event_id) ao aprovar o pagamento,
// o que garante a deduplicação e a cobertura na Meta. Enviar daqui também
// criaria um Purchase paralelo com event_id diferente (duplicidade / cobertura 0%).

function readPdf(filename: string) {
  const filePath = path.join(process.cwd(), "private", "pdfs", filename);
  return fs.readFileSync(filePath);
}

// Identifica o produto pelo nome (a Kiwify dispara 1 webhook por produto/bump)
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
    // Wiapy envia tudo dentro de "data"; Kiwify no nível raiz — funciona pros dois
    const order = (body?.data ?? body) as Record<string, unknown>;

    const customer = (order?.customer ?? {}) as Record<string, unknown>;
    const payment = (order?.payment ?? {}) as Record<string, unknown>;
    const checkout = (order?.checkout ?? {}) as Record<string, unknown>;

    const email = String(customer?.email ?? deepFind(body, ["email"]) ?? "").toLowerCase().trim();
    const name = String(customer?.name ?? deepFind(body, ["full_name", "name"]) ?? "Cliente");
    const rawStatus = String(
      payment?.status ?? deepFind(body, ["order_status", "status", "webhook_event_type", "event"]) ?? "unknown"
    ).toLowerCase();

    // Coleta TODOS os produtos do pedido (Wiapy manda um webhook só com principal + bumps)
    const titles: string[] = [];
    if (Array.isArray(order?.products)) {
      for (const p of order.products as Array<Record<string, unknown>>) {
        if (p?.title) titles.push(String(p.title));
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
      const pn = deepFind(body, ["product_name"]);
      if (pn) titles.push(pn);
    }
    const kinds = Array.from(new Set(titles.map(detectProduct)));
    if (kinds.length === 0) kinds.push("main");

    // Valor do pedido (centavos -> reais). Usa o cobrado; se 0 (cupom), soma os produtos.
    let cents = Number(payment?.amount ?? 0);
    if (!cents) {
      cents += Number(checkout?.amount ?? 0);
      if (Array.isArray(checkout?.orderbump)) {
        for (const ob of checkout.orderbump as Array<Record<string, unknown>>) {
          cents += Number(ob?.amount ?? 0);
        }
      }
    }
    const value = cents > 0 ? cents / 100 : 9.9;

    const isApproval = ["paid", "approved", "completed", "order_approved", "aprovado", "pago"].some((s) =>
      rawStatus.includes(s)
    );

    console.log("[webhook/kiwify] received", {
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

    // Responde IMEDIATAMENTE; a entrega de cada produto roda em segundo plano
    after(async () => {
      for (const kind of kinds) {
        try {
          if (kind === "main") await sendDeliveryEmail(email, name);
          else await sendBumpEmail(email, name, kind);
          console.log("[webhook/kiwify] email enviado:", kind, "->", email);
        } catch (e) {
          console.error("[webhook/kiwify] falha no envio de email:", kind, e);
        }
      }
    });

    return NextResponse.json({ ok: true, queued: true, kinds });
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
  console.log("[webhook/kiwify] resend id=", sendResult.data?.id);
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
  console.log("[webhook/kiwify] bump enviado:", kind, sendResult.data?.id);
}
