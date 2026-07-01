"use client";

import { useEffect } from "react";

const CHECKOUT_URL = "https://zyrocheckout.space/checkout/v5/high/fornecedorvip";

declare global { interface Window { fbq?: (...args: unknown[]) => void; } }

const PRODUCT_DATA = {
  content_name: "Lista de Fornecedores VIP",
  content_category: "Digital Product",
  content_ids: ["fornecedorvip"],
  content_type: "product",
  value: 37.9,
  currency: "BRL",
};

const TRACK_KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","src","sck","fbclid","gclid"];
const UTM_STORE = "fv_utms";

function buildCheckoutUrl() {
  let params: Record<string, string> = {};
  try { params = JSON.parse(localStorage.getItem(UTM_STORE) ?? "{}"); } catch { /**/ }
  try {
    const sp = new URLSearchParams(window.location.search);
    TRACK_KEYS.forEach((k) => { const v = sp.get(k); if (v) params[k] = v; });
  } catch { /**/ }
  const qs = new URLSearchParams(params).toString();
  if (!qs) return CHECKOUT_URL;
  return `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}${qs}`;
}

function waitFbq(cb: (fbq: NonNullable<Window["fbq"]>) => void) {
  let tries = 0;
  const id = setInterval(() => {
    if (window.fbq) { clearInterval(id); cb(window.fbq); }
    else if (++tries > 20) clearInterval(id);
  }, 250);
}

// Dispara ViewContent quando o resultado do quiz aparece
export function QuizViewContent() {
  useEffect(() => {
    waitFbq(fbq => fbq("track", "ViewContent", PRODUCT_DATA));
  }, []);
  return null;
}

export function CheckoutBtn({ label, bar }: { label: string; bar?: boolean }) {
  function go(e: React.MouseEvent) {
    e.preventDefault();
    const dest = buildCheckoutUrl();
    // Dispara IC no nosso domínio para Utmify capturar a atribuição
    waitFbq(fbq => fbq("track", "InitiateCheckout", PRODUCT_DATA));
    setTimeout(() => { window.location.href = dest; }, 300);
  }

  const baseStyle: React.CSSProperties = {
    display: "block", boxSizing: "border-box", textAlign: "center",
    textDecoration: "none", cursor: "pointer", fontFamily: "inherit",
    WebkitTapHighlightColor: "rgba(0,0,0,0)", touchAction: "manipulation",
  };

  if (bar) return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#ea580c", padding:"12px 20px", boxShadow:"0 -2px 12px rgba(0,0,0,0.15)", zIndex:50 }}>
      <a href={CHECKOUT_URL} onClick={go} style={{ ...baseStyle, width:"100%", maxWidth:"480px", margin:"0 auto", background:"#fff", color:"#ea580c", borderRadius:"8px", padding:"14px", fontSize:"15px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.5px" }}>
        {label}
      </a>
    </div>
  );

  return (
    <a href={CHECKOUT_URL} onClick={go} style={{ ...baseStyle, width:"100%", background:"#22c55e", color:"#fff", borderRadius:"12px", padding:"18px", fontSize:"17px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(34,197,94,0.35)", marginBottom:"10px" }}>
      {label}
    </a>
  );
}
