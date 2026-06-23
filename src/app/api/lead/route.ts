import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // ── Supabase ────────────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase
      .from("fornecedores_leads")
      .upsert({ email, updated_at: new Date().toISOString() }, { onConflict: "email" });

    if (error) {
      console.error("[lead] supabase error:", error.message);
    }
  }

  // ── Resend (fire-and-forget) ────────────────────────────────────────────
  sendWelcomeEmail(email).catch((e) =>
    console.error("[lead] resend error:", e?.message)
  );

  return NextResponse.json({ ok: true });
}

async function sendWelcomeEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.FROM_EMAIL ?? "Fornecedores VIP <lista@seudominio.com>";
  const checkoutUrl = process.env.CHECKOUT_URL ?? "#";

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#ea580c;">FORNECEDORES VIP</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;line-height:1.3;">
            Você está a um passo de ter acesso à lista. 🎯
          </h1>
          <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.6;">
            Sua lista com <strong>+500 fornecedores direto da fonte</strong> está esperando por você.
          </p>
          <ul style="margin:0 0 24px;padding-left:20px;color:#555;font-size:14px;line-height:1.8;">
            <li>✅ +500 fornecedores verificados</li>
            <li>✅ Comece com menos de R$100</li>
            <li>✅ Sem CNPJ / sem pedido mínimo</li>
            <li>✅ Envio para todo Brasil</li>
          </ul>
          <a href="${checkoutUrl}"
             style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 28px;border-radius:100px;text-transform:uppercase;">
            ACESSAR FORNECEDORES →
          </a>
          <p style="margin:24px 0 0;font-size:11px;color:#9ca3af;line-height:1.5;">
            Você recebeu esse e-mail porque demonstrou interesse na lista de fornecedores.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from,
    to: email,
    subject: "Sua lista de fornecedores está esperando 📦",
    html,
  });
}
