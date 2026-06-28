"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const CHECKOUT_URL = "https://pay.wiapy.com/lzRXtuSG_Ku";
const PRICE_VALUE = 37.9;

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; }
}

const PRODUCT_DATA = {
  content_name: "Lista de Fornecedores VIP",
  content_category: "Digital Product",
  content_ids: ["fornecedorvip"],
  content_type: "product",
  value: PRICE_VALUE,
  currency: "BRL",
};

/* ─── rastreamento Supabase ─────────────────────────────────── */

function makeSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function trackStep(sessionId: string, step: number, stepName: string, answers: Record<string, string>) {
  try {
    await supabase.from("quiz_sessions").upsert(
      { session_id: sessionId, step, step_name: stepName, answers, updated_at: new Date().toISOString() },
      { onConflict: "session_id" }
    );
  } catch { /* silencioso */ }
}

/* ─── UTM / checkout ────────────────────────────────────────── */

const TRACK_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid", "gclid"];
const UTM_STORE = "fv_utms";

function persistUTMs() {
  try {
    const sp = new URLSearchParams(window.location.search);
    const stored: Record<string, string> = {};
    let found = false;
    TRACK_KEYS.forEach((k) => { const v = sp.get(k); if (v) { stored[k] = v; found = true; } });
    if (found) localStorage.setItem(UTM_STORE, JSON.stringify(stored));
  } catch { /* ignore */ }
}

function buildCheckoutUrl() {
  let params: Record<string, string> = {};
  try { params = JSON.parse(localStorage.getItem(UTM_STORE) ?? "{}"); } catch { /* ignore */ }
  try {
    const sp = new URLSearchParams(window.location.search);
    TRACK_KEYS.forEach((k) => { const v = sp.get(k); if (v) params[k] = v; });
  } catch { /* ignore */ }
  const qs = new URLSearchParams(params).toString();
  if (!qs) return CHECKOUT_URL;
  return `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}${qs}`;
}

let redirecting = false;
function goToCheckout(e?: React.MouseEvent) {
  if (e) e.preventDefault();
  if (redirecting) return;
  redirecting = true;
  const eventId = `ic_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const dest = buildCheckoutUrl();
  try { window.fbq?.("track", "InitiateCheckout", PRODUCT_DATA, { eventID: eventId }); } catch { /* ignore */ }
  const fbp = document.cookie.split(";").find((c) => c.trim().startsWith("_fbp="))?.split("=")[1] ?? "";
  const fbc = document.cookie.split(";").find((c) => c.trim().startsWith("_fbc="))?.split("=")[1] ?? "";
  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fbp, fbc, url: window.location.href, event_id: eventId, value: PRICE_VALUE }),
    keepalive: true,
  }).catch(() => {});
  setTimeout(() => { window.location.href = dest; }, 350);
}

/* ─── dados do quiz ─────────────────────────────────────────── */

const STEPS = [
  "capa",
  "q1_experiencia",
  "transicao1",
  "q2_onde_compra",
  "dado",
  "q3_situacao",
  "q4_capital",
  "q5_categoria",
  "q6_cnpj",
  "loading",
  "resultado",
] as const;

type StepId = typeof STEPS[number];

const CATEGORIAS: Record<string, { fornecedores: number; margem: string; exemplo: string }> = {
  "👗 Roupas e Lingerie":           { fornecedores: 38, margem: "150% a 350%", exemplo: "Camiseta que custa R$14 no atacado vende por R$49,90" },
  "💄 Maquiagem e Cosméticos":      { fornecedores: 24, margem: "200% a 400%", exemplo: "Kit maquiagem por R$22 — vende por R$89" },
  "📱 Eletrônicos e Acessórios":    { fornecedores: 31, margem: "100% a 250%", exemplo: "Fone bluetooth por R$18 — vende por R$59,90" },
  "🎮 Games, Brinquedos e Papelaria": { fornecedores: 22, margem: "120% a 300%", exemplo: "Controle por R$25 — vende por R$79,90" },
  "🍎 Alimentos e Suplementos":     { fornecedores: 19, margem: "100% a 200%", exemplo: "Whey 1kg por R$45 — vende por R$119" },
  "💎 Bijuterias e Semijoias":      { fornecedores: 27, margem: "300% a 400%", exemplo: "Brinco por R$4 — vende por R$19,90" },
};

function useIsMobile() {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ─── componentes base ──────────────────────────────────────── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", background: "#f3f4f6", height: "6px", borderRadius: "100px", marginBottom: "24px" }}>
      <div style={{ width: `${pct}%`, background: "#ea580c", height: "100%", borderRadius: "100px", transition: "width 0.4s ease" }} />
    </div>
  );
}

function OrangeBtn({ children, onClick, fullWidth }: { children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; fullWidth?: boolean }) {
  return (
    <button onClick={onClick} style={{ display: "block", width: fullWidth ? "100%" : undefined, boxSizing: "border-box", background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: "16px 28px", fontSize: "16px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.4px", boxShadow: "0 4px 16px rgba(234,88,12,0.3)", fontFamily: "inherit", textAlign: "center" }}>
      {children}
    </button>
  );
}

function OptionBtn({ children, onClick, selected }: { children: React.ReactNode; onClick: () => void; selected?: boolean }) {
  return (
    <button onClick={onClick} style={{ display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", background: selected ? "#fff7ed" : "#fff", border: `2px solid ${selected ? "#ea580c" : "#e5e7eb"}`, borderRadius: "10px", padding: "14px 16px", fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#111", fontFamily: "inherit", transition: "border-color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

/* ─── Página principal ──────────────────────────────────────── */

export default function QuizOfertaPage() {
  const isMobile = useIsMobile();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const sessionId = useRef(makeSessionId());
  const [loadingPct, setLoadingPct] = useState(0);

  const step = STEPS[stepIdx];
  // perguntas são steps 1-8 (excluindo capa, loading, resultado e transições)
  const questionSteps = STEPS.filter(s => s.startsWith("q")).length;
  const questionIdx = STEPS.filter(s => s.startsWith("q")).indexOf(step as StepId);

  useEffect(() => { persistUTMs(); }, []);

  useEffect(() => {
    window.fbq?.("track", "ViewContent", PRODUCT_DATA);
  }, []);

  // rastreia no Supabase sempre que o step muda
  useEffect(() => {
    trackStep(sessionId.current, stepIdx, step, answers);
  }, [stepIdx, step, answers]);

  // loading animation
  useEffect(() => {
    if (step !== "loading") return;
    setLoadingPct(0);
    const msgs = [10, 35, 60, 85, 100];
    const timers = msgs.map((pct, i) =>
      setTimeout(() => setLoadingPct(pct), i * 600)
    );
    const nav = setTimeout(() => setStepIdx(s => s + 1), msgs.length * 600 + 300);
    return () => { timers.forEach(clearTimeout); clearTimeout(nav); };
  }, [step]);

  function next() { setStepIdx(s => s + 1); }

  function answer(key: string, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(next, 300);
  }

  const maxW = isMobile ? "480px" : "560px";
  const pad = isMobile ? "24px 18px" : "32px 28px";

  const cat = answers.categoria ? CATEGORIAS[answers.categoria] : null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9fafb", minHeight: "100vh", color: "#111" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .quiz-card { animation: fadeUp 0.3s ease; }
      ` }} />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 20px", textAlign: "center" }}>
        <span style={{ fontSize: "18px", fontWeight: 900, color: "#ea580c" }}>Fornecedor<span style={{ color: "#111" }}>Vip</span></span>
      </div>

      <div style={{ maxWidth: maxW, margin: "0 auto", padding: isMobile ? "20px 16px 80px" : "32px 20px 80px" }}>

        {/* ── CAPA ── */}
        {step === "capa" && (
          <div className="quiz-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: pad }}>
            <div style={{ display: "inline-block", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", fontWeight: 700, color: "#ea580c", marginBottom: "18px" }}>
              🎯 TESTE RÁPIDO • 2 MINUTOS
            </div>
            <h1 style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: 900, lineHeight: 1.2, marginBottom: "14px" }}>
              Descubra quais fornecedores diretos combinam com o que você quer vender
            </h1>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.6, marginBottom: "24px" }}>
              Responda 6 perguntas rápidas e veja exatamente onde você pode comprar mais barato — com margem de até 400%.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {["✅ Sem precisar de CNPJ", "✅ Começando com menos de R$100", "✅ Fornecedores verificados e testados"].map(t => (
                <div key={t} style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>{t}</div>
              ))}
            </div>
            <OrangeBtn onClick={next} fullWidth>COMEÇAR O TESTE →</OrangeBtn>
            <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "12px" }}>🔒 Gratuito • Sem cadastro • Resultado na hora</p>
          </div>
        )}

        {/* ── Q1 ── */}
        {step === "q1_experiencia" && (
          <div className="quiz-card">
            <ProgressBar current={1} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 1 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3 }}>
              Você já tentou revender algum produto?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "✅ Sim, já vendo ou já vendi",
                "🔄 Tentei mas travei em algum ponto",
                "🤔 Ainda não, mas quero começar",
                "💭 Tenho interesse mas ainda estou pesquisando",
              ].map(opt => (
                <OptionBtn key={opt} selected={answers.experiencia === opt} onClick={() => answer("experiencia", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── TRANSIÇÃO 1 ── */}
        {step === "transicao1" && (
          <div className="quiz-card" style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "16px", padding: pad, textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>💡</div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "10px" }}>
              Entendido.
            </p>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.6, marginBottom: "24px" }}>
              O problema mais comum é pagar preço de varejo quando poderia estar comprando direto da fonte com <strong>margem de 100% a 400%</strong>.
            </p>
            <p style={{ fontSize: "13px", color: "#ea580c", fontWeight: 700, marginBottom: "20px" }}>
              Continue pra descobrir o que pode estar custando dinheiro sem você perceber. 👇
            </p>
            <OrangeBtn onClick={next} fullWidth>CONTINUAR →</OrangeBtn>
          </div>
        )}

        {/* ── Q2 ── */}
        {step === "q2_onde_compra" && (
          <div className="quiz-card">
            <ProgressBar current={2} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 2 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3 }}>
              Onde você costuma (ou pretende) comprar os produtos para revender?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "🛍️ Lojas físicas ou varejo online",
                "📦 Mercado Livre ou Shopee como compradora",
                "🏭 Já compro de atacadistas mas não sei se são os melhores",
                "✅ Já tenho fornecedores diretos e bons",
              ].map(opt => (
                <OptionBtn key={opt} selected={answers.onde_compra === opt} onClick={() => answer("onde_compra", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── DADO ── */}
        {step === "dado" && (
          <div className="quiz-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: pad }}>
            <div style={{ background: "#111", borderRadius: "12px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 700, marginBottom: "10px", letterSpacing: "0.1em" }}>VAREJO VS ATACADO</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#1a1a1a", borderRadius: "10px", padding: "14px", border: "1px solid #333" }}>
                  <div style={{ fontSize: "10px", color: "#ef4444", fontWeight: 700, marginBottom: "6px" }}>❌ VAREJO</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>R$49,90</div>
                  <div style={{ fontSize: "11px", color: "#777", marginTop: "4px" }}>você paga</div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: "10px", padding: "14px", border: "1px solid #22c55e" }}>
                  <div style={{ fontSize: "10px", color: "#22c55e", fontWeight: 700, marginBottom: "6px" }}>✅ ATACADO</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: "#22c55e" }}>R$14,00</div>
                  <div style={{ fontSize: "11px", color: "#777", marginTop: "4px" }}>com a lista</div>
                </div>
              </div>
              <div style={{ marginTop: "12px", fontSize: "13px", color: "#f59e0b", fontWeight: 800 }}>→ Margem de 256% na mesma camiseta</div>
            </div>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, marginBottom: "20px" }}>
              O segredo não é vender mais. É <strong>comprar certo desde o início.</strong>
            </p>
            <OrangeBtn onClick={next} fullWidth>ENTENDI, CONTINUAR →</OrangeBtn>
          </div>
        )}

        {/* ── Q3 ── */}
        {step === "q3_situacao" && (
          <div className="quiz-card">
            <ProgressBar current={3} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 3 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3 }}>
              Qual dessas situações mais se parece com a sua realidade hoje?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "😓 Quero vender mas não sei onde achar fornecedor confiável",
                "🤔 Tenho medo de cair em golpe ou receber produto ruim",
                "💸 Acho que preciso de muito dinheiro pra começar",
                "📦 Já compro mas minha margem não está boa",
              ].map(opt => (
                <OptionBtn key={opt} selected={answers.situacao === opt} onClick={() => answer("situacao", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── Q4 ── */}
        {step === "q4_capital" && (
          <div className="quiz-card">
            <ProgressBar current={4} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 4 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3 }}>
              Com quanto você estaria disposta a começar agora?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "💰 Menos de R$100",
                "💰 De R$100 a R$300",
                "💰 De R$300 a R$500",
                "💰 Mais de R$500",
              ].map(opt => (
                <OptionBtn key={opt} selected={answers.capital === opt} onClick={() => answer("capital", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── Q5 ── */}
        {step === "q5_categoria" && (
          <div className="quiz-card">
            <ProgressBar current={5} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 5 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.3 }}>
              Qual categoria te interessa mais?
            </h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "18px" }}>Seu resultado vai mostrar quantos fornecedores temos nessa categoria.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.keys(CATEGORIAS).map(opt => (
                <OptionBtn key={opt} selected={answers.categoria === opt} onClick={() => answer("categoria", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── Q6 ── */}
        {step === "q6_cnpj" && (
          <div className="quiz-card">
            <ProgressBar current={6} total={questionSteps} />
            <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>PERGUNTA 6 DE 6</p>
            <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3 }}>
              Você tem CNPJ ou prefere comprar como pessoa física?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "🪪 Só tenho CPF",
                "🏢 Tenho CNPJ",
                "🤷 Não sei se preciso de CNPJ",
              ].map(opt => (
                <OptionBtn key={opt} selected={answers.cnpj === opt} onClick={() => answer("cnpj", opt)}>{opt}</OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === "loading" && (
          <div className="quiz-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: pad, textAlign: "center" }}>
            <div style={{ fontSize: "38px", marginBottom: "18px" }}>⚙️</div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "20px" }}>Analisando seu perfil...</h2>
            <div style={{ background: "#f3f4f6", borderRadius: "100px", height: "8px", marginBottom: "16px" }}>
              <div style={{ width: `${loadingPct}%`, background: "#ea580c", height: "100%", borderRadius: "100px", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", fontSize: "13px", color: "#555" }}>
              {loadingPct >= 35 && <div>✅ Verificando fornecedores disponíveis...</div>}
              {loadingPct >= 60 && <div>✅ Calculando margem potencial...</div>}
              {loadingPct >= 85 && <div>✅ Preparando resultado personalizado...</div>}
            </div>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {step === "resultado" && (
          <div className="quiz-card">
            {/* Header resultado */}
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "16px", padding: "20px", marginBottom: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ea580c", marginBottom: "8px" }}>🎯 SEU RESULTADO</div>
              <h2 style={{ fontSize: isMobile ? "20px" : "22px", fontWeight: 900, lineHeight: 1.3, marginBottom: "10px" }}>
                {cat
                  ? `Encontramos ${cat.fornecedores} fornecedores de ${answers.categoria?.split(" ").slice(1).join(" ")} na lista`
                  : "Encontramos mais de 180 fornecedores verificados para o seu perfil"}
              </h2>
              {cat && (
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.5 }}>
                  Com margem média de <strong style={{ color: "#ea580c" }}>{cat.margem}</strong>.<br />
                  <em style={{ fontSize: "12px", color: "#9ca3af" }}>{cat.exemplo}</em>
                </p>
              )}
            </div>

            {/* Dados baseados nas respostas */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#111", marginBottom: "14px" }}>O que você vai receber:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  `${cat ? cat.fornecedores : "180"}+ fornecedores verificados com contato direto`,
                  answers.cnpj?.includes("CPF") || answers.cnpj?.includes("sei")
                    ? "✅ A maioria aceita CPF — sem precisar de CNPJ"
                    : "✅ Fornecedores que aceitam CNPJ e emitem nota fiscal",
                  answers.capital?.includes("100")
                    ? "✅ Vários fornecedores com pedido mínimo abaixo de R$100"
                    : "✅ Fornecedores para todos os tamanhos de pedido",
                  "WhatsApp e site oficial de cada fornecedor",
                  "Avaliação de confiabilidade — só fornecedores testados",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#333" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0, fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prova social */}
            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "14px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", color: "#f59e0b", marginBottom: "6px" }}>★★★★★</div>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                "Comprei, abri a lista e em 20 minutos já tinha o WhatsApp de 3 fornecedores que eu nunca achei no Google. Primeiro pedido no mesmo dia."
              </p>
            </div>

            {/* Oferta */}
            <div style={{ background: "#fff", border: "2px solid #ea580c", borderRadius: "16px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 14px", borderRadius: "100px", marginBottom: "12px" }}>ACESSO COMPLETO</div>
              <div style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through", marginBottom: "4px" }}>De R$397,00 por apenas:</div>
              <div style={{ fontSize: "46px", fontWeight: 900, color: "#ea580c", lineHeight: 1, marginBottom: "6px" }}>R$37,90</div>
              <div style={{ fontSize: "12px", color: "#22c55e", fontWeight: 700, marginBottom: "18px" }}>PAGAMENTO ÚNICO • ACESSO VITALÍCIO</div>
              <a
                href={CHECKOUT_URL}
                onClick={goToCheckout}
                style={{ display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", width: "100%", background: "#22c55e", color: "#fff", border: "none", borderRadius: "12px", padding: "18px", fontSize: "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", marginBottom: "10px" }}
              >
                QUERO ACESSAR AGORA →
              </a>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>🔒 Pix ou cartão • Acesso na hora no e-mail • 7 dias de garantia</p>
            </div>

            {/* Por que barato */}
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#111", marginBottom: "4px" }}>🤔 Por que tão barato?</div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.6 }}>
                É promoção de lançamento. Preferimos cobrar pouco e ter milhares de clientes satisfeitas do que cobrar caro de poucas. E você ainda tem <strong>7 dias de garantia</strong> — se não gostar, devolvemos 100%. Risco zero.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra fixa no resultado */}
      {step === "resultado" && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#ea580c", padding: "12px 20px", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)", zIndex: 50 }}>
          <a href={CHECKOUT_URL} onClick={goToCheckout} style={{ width: "100%", maxWidth: "480px", margin: "0 auto", display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", background: "#fff", color: "#ea580c", border: "none", borderRadius: "8px", padding: "14px", fontSize: "15px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "inherit" }}>
            ACESSAR FORNECEDORES — R$37,90
          </a>
        </div>
      )}
    </div>
  );
}
