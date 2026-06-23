"use client";

import { useState } from "react";

// ── Dados ──────────────────────────────────────────────────────────────────

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

const beneficios = [
  "+ DE 500 FORNECEDORES DIRETO DA FONTE",
  "COMECE COM MENOS DE R$100 REAIS",
  "NÃO PRECISA DE CNPJ / SEM PEDIDO MÍNIMO",
  "ENVIO PARA TODO BRASIL",
  "TEM TODAS AS CATEGORIAS",
];

const dores = [
  {
    title: "Você não sabe onde comprar barato para ter margem real",
    text: "Todo mundo fala em revender, mas ninguém te diz onde comprar de verdade. Você paga preço de varejo e ainda tenta lucrar. Não dá.",
  },
  {
    title: "Você tem medo de cair em fornecedor falso",
    text: "Já ouviu história de quem perdeu dinheiro com fornecedor que sumiu ou entregou coisa errada. Por isso você trava na hora de começar.",
  },
  {
    title: "Você acha que precisa de muito capital pra começar",
    text: "Mito. Dá pra começar com menos de R$100 se você souber onde comprar. O segredo é o fornecedor certo, não o capital.",
  },
];

const faqs = [
  {
    q: "O que é a Lista de Fornecedores?",
    a: "É um arquivo com mais de 500 fornecedores verificados, com contato direto, categorias de produtos, condições de compra e forma de pagamento. Tudo que você precisa para começar a revender hoje mesmo.",
  },
  {
    q: "Preciso de CNPJ para comprar dos fornecedores?",
    a: "Não! A maioria dos fornecedores da lista vende para pessoa física. Você consegue comprar com CPF mesmo.",
  },
  {
    q: "Quais categorias de produtos têm na lista?",
    a: "Moda, calçados, beleza, eletrônicos, casa, infantil, fitness e muito mais. A lista cobre os nichos que mais vendem no Mercado Livre, Amazon, Shopee e Facebook.",
  },
  {
    q: "Como recebo o acesso após a compra?",
    a: "Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail. O acesso é vitalício.",
  },
  {
    q: "Tem garantia?",
    a: "Sim. Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas.",
  },
];

// ── Ícones inline (sem dependência) ────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Componente principal ────────────────────────────────────────────────────

export default function FornecedoresPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setTimeout(() => { window.location.href = CHECKOUT_URL; }, 1400);
    } catch {
      setErro("Erro ao salvar e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Urgency bar */}
      <div style={{ background: "#ea580c", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.3px" }}>
        🔥 OFERTA ESPECIAL — ACESSO COM DESCONTO SOMENTE HOJE
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Logo — TODO: substituir pelo <img> com logo real */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ fontSize: "20px", fontWeight: 900, color: "#ea580c", letterSpacing: "-0.5px" }}>
            FORNECEDORES<span style={{ color: "#111" }}>VIP</span>
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ textAlign: "center", fontSize: "21px", fontWeight: 900, color: "#111", marginTop: "16px", lineHeight: 1.25, textTransform: "uppercase" }}>
          TENHA ACESSO À LISTA COM{" "}
          <span style={{ color: "#ea580c" }}>+500 FORNECEDORES</span>{" "}
          DIRETO DA FONTE, TESTADOS E APROVADOS ✅
        </h1>

        {/* Imagem — TODO: substituir pelo grid de fotos reais */}
        <div style={{ margin: "20px 0", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            {(["📦", "👗", "👟", "💄"] as const).map((emoji) => (
              <div key={emoji} style={{ background: "#f3f4f6", height: "110px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                {emoji}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", background: "#f472b6", color: "#fff", borderRadius: "24px", padding: "8px 18px", fontSize: "11px", fontWeight: 800, textAlign: "center", whiteSpace: "nowrap", lineHeight: 1.4, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            LUCRE MUITO MAIS<br />EM CIMA DE CADA PEÇA<br />+ 100%
          </div>
        </div>

        {/* Benefícios */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "20px 0" }}>
          {beneficios.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px 14px" }}>
              <IconCheck />
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Dores */}
        <h2 style={{ textAlign: "center", fontSize: "18px", fontWeight: 800, color: "#111", margin: "32px 0 14px" }}>
          Isso parece com você?
        </h2>
        {dores.map((d) => (
          <div key={d.title} style={{ marginBottom: "10px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "14px" }}>
            <p style={{ fontWeight: 700, fontSize: "14px", color: "#c2410c", marginBottom: "6px" }}>{d.title}</p>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.55 }}>{d.text}</p>
          </div>
        ))}

        {/* Selos de confiança */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "28px 0", flexWrap: "wrap" }}>
          {["🔒 100% Seguro", "⚡ Acesso imediato", "✅ 7 dias garantia"].map((s) => (
            <span key={s} style={{ fontSize: "12px", fontWeight: 600, color: "#555" }}>{s}</span>
          ))}
        </div>

        {/* Card oferta + captura de e-mail */}
        <div style={{ border: "2px solid #ea580c", borderRadius: "16px", padding: "24px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#9ca3af", textDecoration: "line-through", marginBottom: "4px" }}>de R$97,00</p>
          <p style={{ fontSize: "42px", fontWeight: 900, color: "#ea580c", lineHeight: 1, marginBottom: "4px" }}>R$19,90</p>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>acesso vitalício + lista completa</p>

          {submitted ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "14px", fontSize: "14px", fontWeight: 600, color: "#16a34a" }}>
              ✅ Perfeito! Redirecionando para o checkout...
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1.5px solid #d1d5db", fontSize: "15px", outline: "none", textAlign: "center" }}
              />
              {erro && <p style={{ fontSize: "12px", color: "#dc2626" }}>{erro}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? "#fb923c" : "#ea580c", color: "#fff", border: "none", borderRadius: "10px", padding: "16px", fontSize: "16px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {loading ? "PROCESSANDO..." : "ACESSAR FORNECEDORES →"}
              </button>
            </form>
          )}

          <p style={{ marginTop: "12px", fontSize: "11px", color: "#9ca3af" }}>🔒 Pagamento 100% seguro via Kiwify</p>
        </div>

        {/* FAQ */}
        <h2 style={{ textAlign: "center", fontSize: "18px", fontWeight: 800, color: "#111", margin: "40px 0 14px" }}>
          Perguntas frequentes
        </h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ marginBottom: "8px", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontWeight: 700, fontSize: "13px", color: "#111", gap: "8px" }}
            >
              <span>{f.q}</span>
              <IconChevron open={openFaq === i} />
            </button>
            {openFaq === i && (
              <div style={{ padding: "0 16px 14px", fontSize: "13px", color: "#555", lineHeight: 1.6 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}

        {/* CTA final */}
        <div style={{ marginTop: "32px" }}>
          <button
            onClick={() => { window.location.href = CHECKOUT_URL; }}
            style={{ width: "100%", background: "#ea580c", color: "#fff", border: "none", borderRadius: "10px", padding: "18px", fontSize: "16px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            ACESSAR FORNECEDORES
          </button>
          <p style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#9ca3af" }}>
            🔒 Compra 100% segura • Acesso imediato • 7 dias de garantia
          </p>
        </div>
      </div>

      {/* Barra CTA fixa no rodapé (mobile) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#ea580c", padding: "12px 20px", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)", zIndex: 50 }}>
        <button
          onClick={() => { window.location.href = CHECKOUT_URL; }}
          style={{ width: "100%", maxWidth: "480px", margin: "0 auto", display: "block", background: "#fff", color: "#ea580c", border: "none", borderRadius: "8px", padding: "14px", fontSize: "15px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          ACESSAR FORNECEDORES — R$19,90
        </button>
      </div>
    </div>
  );
}
