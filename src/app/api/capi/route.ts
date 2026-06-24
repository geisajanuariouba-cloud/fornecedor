import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID = "1274073178133799";
const TOKEN = process.env.META_CAPI_TOKEN ?? "";

function hash(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ua = req.headers.get("user-agent") ?? "";
    const fbp = body.fbp ?? "";
    const fbc = body.fbc ?? "";
    const eventSourceUrl = body.url ?? "https://fornecedorvip.shop";

    const payload = {
      data: [
        {
          event_name: "InitiateCheckout",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: eventSourceUrl,
          user_data: {
            ...(ip ? { client_ip_address: ip } : {}),
            ...(ua ? { client_user_agent: ua } : {}),
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
          custom_data: {
            currency: "BRL",
            value: 9.90,
            content_name: "Lista de Fornecedores VIP",
            content_category: "Digital Product",
          },
        },
      ],
      test_event_code: process.env.META_TEST_CODE ?? undefined,
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return NextResponse.json({ ok: true, meta: data });
  } catch (e) {
    console.error("[capi]", e);
    return NextResponse.json({ ok: false });
  }
}
