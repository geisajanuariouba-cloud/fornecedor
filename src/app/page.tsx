"use client";

import { useState, useEffect } from "react";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

function useCountdown(totalSeconds: number) {
  const [time, setTime] = useState(totalSeconds);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600).toString().padStart(2, "0");
  const m = Math.floor((time % 3600) / 60).toString().padStart(2, "0");
  const s = (time % 60).toString().padStart(2, "0");
  return { h, m, s };
}

const categorias = [
  { emoji: "👙", label: "LINGERIE" },
  { emoji: "👗", label: "MODA FEMININA" },
  { emoji: "🧕", label: "MODA MODESTA" },
  { emoji: "🏖️", label: "MODA PRAIA" },
  { emoji: "🍼", label: "INFANTIL" },
  { emoji: "➕", label: "PLUS SIZE" },
  { emoji: "🏋️", label: "MODA FITNESS" },
  { emoji: "👔", label: "MODA MASCULINA" },
  { emoji: "🧵", label: "ALFAIATARIA" },
  { emoji: "💍", label: "ACESSÓRIOS" },
  { emoji: "👜", label: "BOLSAS E MOCHILAS" },
  { emoji: "👖", label: "MODA JEANS" },
  { emoji: "👕", label: "T-SHIRTS" },
  { emoji: "🧶", label: "TRICOT" },
  { emoji: "🌙", label: "PIJAMAS" },
];

const oquerecebes = [
  "+500 fornecedores verificados direto da fonte",
  "Contato direto: WhatsApp, site e telefone de cada fornecedor",
  "Comece com menos de R$100 — sem pedido mínimo alto",
  "Não precisa de CNPJ — pode comprar como pessoa física",
  "Todas as categorias: moda, calçados, acessórios, casa e muito mais",
  "Fornecedores que enviam para todo o Brasil",
  "Preços de atacado real — margem de 100% a 400%",
  "Lista atualizada — fornecedores testados e aprovados",
];

const bonuses = [
  {
    n: "01",
    title: "GUIA LOJA DE 10",
    desc: "Aprenda a montar sua loja virtual do zero e faturar seus primeiros R$1.000 na primeira semana de vendas.",
    valor: "R$47",
  },
  {
    n: "02",
    title: "LISTA DOS PRODUTOS MAIS VENDIDOS",
    desc: "Os produtos hot que mais vendem no Mercado Livre, Shopee e Amazon — já com fornecedor incluído na lista.",
    valor: "R$37",
  },
  {
    n: "03",
    title: "PACOTE INFLUENCER PARA INSTAGRAM",
    desc: "Templates prontos para vender no Instagram sem precisar aparecer. Ideal para iniciantes no digital.",
    valor: "R$57",
  },
  {
    n: "04",
    title: "CATÁLOGO DE TENDÊNCIAS",
    desc: "As tendências de moda da próxima temporada para você comprar antes de todo mundo e vender com mais margem.",
    valor: "R$47",
  },
  {
    n: "05",
    title: "COMO GERAR IMAGENS COM IA",
    desc: "Crie fotos profissionais dos seus produtos com inteligência artificial, sem fotógrafo e sem modelo.",
    valor: "R$37",
  },
];

const depoimentos = [
  {
    texto:
      "Acabei de acessar a lista! Já to preparando meu primeiro pedido, muito obrigada 🥰",
    horario: "17:07",
  },
  {
    texto:
      "Pedi vários peças e realmente são muito baratas, já vendi mais da metade, obrigadas ✨",
    horario: "19:03",
  },
  {
    texto:
      "Entrei em contato com os fornecedores que eu queria e já estou no processo de compra. Muito obrigada, me ajudou demaaais! 🙏",
    horario: "14:32",
  },
  {
    texto: "Tudo certinho Amei ✅\nMaterial perfeito\nTudo lindo 🌸",
    horario: "14:00",
  },
];

const faqs = [
  {
    q: "O que é a Lista de Fornecedores?",
    a: "É um arquivo digital com mais de 500 fornecedores verificados, com contato direto, categorias de produtos, condições de compra e forma de pagamento. Tudo que você precisa para começar a revender hoje mesmo.",
  },
  {
    q: "Preciso de CNPJ para comprar dos fornecedores?",
    a: "Não! A maioria dos fornecedores da lista vende para pessoa física. Você consegue comprar com CPF mesmo, sem burocracia.",
  },
  {
    q: "Com quanto capital posso começar?",
    a: "Com menos de R$100! A maioria dos fornecedores aceita pedidos pequenos — perfeitos para quem está começando e quer testar antes de investir mais.",
  },
  {
    q: "Quais categorias têm na lista?",
    a: "Moda feminina, lingerie, calçados, moda praia, fitness, infantil, plus size, acessórios, bolsas, eletrônicos, casa e muito mais. A lista cobre todos os nichos que mais vendem no Mercado Livre, Amazon, Shopee e Facebook.",
  },
  {
    q: "Como recebo o acesso após a compra?",
    a: "Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail. O acesso é vitalício.",
  },
  {
    q: "Tem garantia?",
    a: "Sim. Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas e sem burocracia.",
  },
  {
    q: "Posso vender em marketplace (Mercado Livre, Shopee, Amazon)?",
    a: "Com certeza! Os fornecedores da lista já foram selecionados pensando nos marketplaces. Você consegue margem suficiente para cobrir taxas e ainda lucrar bem.",
  },
];

function IconCheck({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#555"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        flexShrink: 0,
        transition: "transform 0.2s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        border: "1.5px solid #ea580c",
        borderRadius: "100px",
        padding: "6px 18px",
        fontSize: "12px",
        fontWeight: 700,
        color: "#ea580c",
        letterSpacing: "0.08em",
        marginBottom: "14px",
      }}
    >
      {children}
    </div>
  );
}

export default function FornecedoresPage() {
  const { h, m, s } = useCountdown(2 * 3600 + 47 * 60 + 33);
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
      setTimeout(() => {
        window.location.href = CHECKOUT_URL;
      }, 1400);
    } catch {
      setErro("Erro ao salvar e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const W = 480;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#fff",
        minHeight: "100vh",
        color: "#111",
      }}
    >
      {/* ── Urgency bar ── */}
      <div
        style={{
          background: "#ea580c",
          color: "#fff",
          textAlign: "center",
          padding: "10px 16px",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        🔥 OFERTA ESPECIAL ENCERRA EM:{" "}
        <span
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "6px",
            padding: "2px 8px",
            marginLeft: "6px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {h}:{m}:{s}
        </span>
      </div>

      {/* ── HERO ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #fff7ed 0%, #fff 60%)",
          padding: "36px 20px 48px",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#ea580c",
                letterSpacing: "-0.5px",
              }}
            >
              FORNECEDORES<span style={{ color: "#111" }}>VIP</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#ea580c" }}>+500 FORNECEDORES</span> DIRETO
            DA FONTE PARA VOCÊ REVENDER E LUCRAR DE VERDADE
          </h1>

          <p
            style={{
              textAlign: "center",
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.6,
              marginBottom: "28px",
            }}
          >
            Acesse hoje a lista com os melhores fornecedores de moda, calçados,
            acessórios e muito mais — testados, verificados e prontos para você
            comprar sem CNPJ.
          </p>

          {/* Hero CTA */}
          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "18px",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 20px rgba(234,88,12,0.35)",
            }}
          >
            QUERO ACESSAR AGORA →
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "10px",
            }}
          >
            🔒 Pagamento 100% seguro • Acesso imediato • 7 dias de garantia
          </p>

          {/* Trust numbers */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            {[
              { n: "+500", label: "Fornecedores" },
              { n: "+5mil", label: "Clientes" },
              { n: "100%", label: "Verificados" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    color: "#ea580c",
                  }}
                >
                  {item.n}
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIAS ── */}
      <div
        style={{
          background: "#fff",
          padding: "40px 20px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>O QUE VOCÊ ACESSA</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            VEJA AS CATEGORIAS QUE VOCÊ PODE ACESSAR AINDA HOJE
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}
          >
            Fornecedores em todas as categorias que mais vendem no Brasil
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            {categorias.map((cat) => (
              <div
                key={cat.label}
                style={{
                  border: "2px solid #ea580c",
                  borderRadius: "12px",
                  padding: "16px 8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fff7ed",
                }}
              >
                <span style={{ fontSize: "28px" }}>{cat.emoji}</span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "#111",
                    textAlign: "center",
                    letterSpacing: "0.03em",
                    lineHeight: 1.3,
                  }}
                >
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            QUERO ACESSAR ESSAS CATEGORIAS
          </button>
        </div>
      </div>

      {/* ── O QUE VOCÊ VAI RECEBER ── */}
      <div
        style={{
          background: "#fff7ed",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>CONTEÚDO</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            NA LISTA VIP VOCÊ VAI RECEBER:
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {oquerecebes.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  background: "#fff",
                  border: "1px solid #fed7aa",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  textAlign: "left",
                }}
              >
                <IconCheck />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "24px",
            }}
          >
            QUERO LIBERAR MEU ACESSO →
          </button>
        </div>
      </div>

      {/* ── COMPARAÇÃO ── */}
      <div style={{ background: "#fff", padding: "40px 20px" }}>
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>POR QUE A LISTA VIP?</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            A DIFERENÇA É GRITANTE
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* SEM a lista */}
            <div
              style={{
                border: "2px solid #fecaca",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#fee2e2",
                  padding: "10px",
                  fontWeight: 800,
                  fontSize: "12px",
                  color: "#dc2626",
                }}
              >
                ❌ SEM A LISTA
              </div>
              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[
                  "Compra no varejo e perde margem",
                  "Não sabe onde achar fornecedor",
                  "Cai em golpe de fornecedor falso",
                  "Acha que precisa de muito capital",
                  "Fica travada sem saber por onde começar",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                      textAlign: "left",
                    }}
                  >
                    <IconX size={14} />
                    <span style={{ fontSize: "11px", color: "#555" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* COM a lista */}
            <div
              style={{
                border: "2px solid #86efac",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#dcfce7",
                  padding: "10px",
                  fontWeight: 800,
                  fontSize: "12px",
                  color: "#16a34a",
                }}
              >
                ✅ COM A LISTA VIP
              </div>
              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[
                  "Compra no atacado com 100%+ de margem",
                  "+500 fornecedores no bolso",
                  "Todos verificados e aprovados",
                  "Começa com menos de R$100",
                  "Começa hoje mesmo, sem enrolação",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                      textAlign: "left",
                    }}
                  >
                    <IconCheck size={14} />
                    <span style={{ fontSize: "11px", color: "#555" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "24px",
            }}
          >
            QUERO ACESSAR O MÉTODO AGORA →
          </button>
        </div>
      </div>

      {/* ── BÔNUS ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #fff7ed 0%, #fff 100%)",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>POR TEMPO LIMITADO</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            ALÉM DA LISTA, VOCÊ AINDA RECEBE ESTES
          </h2>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "#ea580c",
              marginBottom: "24px",
            }}
          >
            5 BÔNUS EXCLUSIVOS 🎁
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {bonuses.map((b) => (
              <div
                key={b.n}
                style={{
                  border: "1.5px solid #fed7aa",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "left",
                  background: "#fff",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textDecoration: "line-through",
                  }}
                >
                  {b.valor}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#ea580c",
                    marginBottom: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  🎁 BÔNUS {b.n}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#111",
                    marginBottom: "6px",
                  }}
                >
                  {b.title}
                </div>
                <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>
                  {b.desc}
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  DE {b.valor} → GRÁTIS 🎉
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              background: "#ea580c",
              borderRadius: "12px",
              padding: "14px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            VALOR TOTAL DOS BÔNUS: R$225,00 — INCLUSO SEM CUSTO EXTRA 🎯
          </div>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "16px",
            }}
          >
            QUERO TUDO ISSO AGORA →
          </button>
        </div>
      </div>

      {/* ── DEPOIMENTOS ── */}
      <div style={{ background: "#fff", padding: "40px 20px" }}>
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>QUEM USA</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            Não precisa acreditar em mim!
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            Mais de <strong>5.000 pessoas</strong> já usam nossa lista e
            transformaram seus negócios. Veja o que elas mesmas dizem:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            {depoimentos.map((d, i) => (
              <div
                key={i}
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: "12px",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#16a34a",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  💬 {d.horario}
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#333",
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}
                >
                  {d.texto}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "13px",
              color: "#c2410c",
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            Todo dia centenas de pessoas começam a vender usando nossa lista e{" "}
            <span style={{ color: "#ea580c" }}>
              chegam mais perto de realizar seu sonho de renda extra.
            </span>
          </div>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "20px",
            }}
          >
            QUERO FAZER PARTE →
          </button>
        </div>
      </div>

      {/* ── OFERTA / CAPTURA DE EMAIL ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #fff7ed 0%, #fff 100%)",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>OFERTA EXCLUSIVA</PillLabel>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            TUDO ISSO POR APENAS:
          </h2>

          <div
            style={{
              border: "2px solid #ea580c",
              borderRadius: "16px",
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            {/* O que está incluído */}
            <div
              style={{
                textAlign: "left",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                "Lista VIP com +500 fornecedores verificados",
                "Bônus 01 — Guia Loja de 10",
                "Bônus 02 — Lista dos produtos mais vendidos",
                "Bônus 03 — Pacote influencer para Instagram",
                "Bônus 04 — Catálogo de tendências",
                "Bônus 05 — Como gerar imagens com IA",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                  }}
                >
                  <IconCheck size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                textDecoration: "line-through",
                marginBottom: "4px",
              }}
            >
              De R$97,00
            </p>
            <p
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#ea580c",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              R$19,90
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "24px" }}>
              acesso vitalício + todos os bônus
            </p>

            {submitted ? (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: "10px",
                  padding: "14px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#16a34a",
                }}
              >
                ✅ Perfeito! Redirecionando para o checkout...
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "15px",
                    outline: "none",
                    textAlign: "center",
                    fontFamily: "inherit",
                  }}
                />
                {erro && (
                  <p style={{ fontSize: "12px", color: "#dc2626" }}>{erro}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? "#fb923c" : "#ea580c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "18px",
                    fontSize: "16px",
                    fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 4px 20px rgba(234,88,12,0.35)",
                  }}
                >
                  {loading ? "PROCESSANDO..." : "QUERO ACESSAR AGORA →"}
                </button>
              </form>
            )}

            <p
              style={{ marginTop: "12px", fontSize: "11px", color: "#9ca3af" }}
            >
              🔒 Pagamento 100% seguro via Kiwify
            </p>
          </div>

          {/* Selos */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            {["🔒 100% Seguro", "⚡ Acesso imediato", "✅ 7 dias garantia", "💳 Cartão, Pix ou Boleto"].map(
              (s) => (
                <span
                  key={s}
                  style={{ fontSize: "11px", fontWeight: 600, color: "#555" }}
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── GARANTIA ── */}
      <div style={{ background: "#fff", padding: "40px 20px" }}>
        <div style={{ maxWidth: W, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#ea580c",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span style={{ fontSize: "28px" }}>🛡️</span>
          </div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 900,
              marginBottom: "8px",
              color: "#ea580c",
            }}
          >
            Garantia Incondicional de 7 dias
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            Teste a lista por 7 dias. Se você não ficar 100% satisfeita,
            devolvemos todo o seu dinheiro.
          </p>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#ea580c",
              letterSpacing: "0.05em",
            }}
          >
            SEM PERGUNTAS. SEM BUROCRACIA.
          </p>

          <button
            onClick={() => {
              window.location.href = CHECKOUT_URL;
            }}
            style={{
              width: "100%",
              background: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "24px",
            }}
          >
            QUERO GARANTIR MEU ACESSO →
          </button>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div
        style={{
          background: "#f9fafb",
          padding: "40px 20px 100px",
        }}
      >
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 900,
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Perguntas frequentes
          </h2>
          {faqs.map((f, i) => (
            <div
              key={i}
              style={{
                marginBottom: "8px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#111",
                  gap: "8px",
                  fontFamily: "inherit",
                }}
              >
                <span>{f.q}</span>
                <IconChevron open={openFaq === i} />
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 16px 14px",
                    fontSize: "13px",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {f.a}
                </div>
              )}
            </div>
          ))}

          {/* Final CTA */}
          <div style={{ marginTop: "32px" }}>
            <button
              onClick={() => {
                window.location.href = CHECKOUT_URL;
              }}
              style={{
                width: "100%",
                background: "#ea580c",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "18px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 20px rgba(234,88,12,0.35)",
              }}
            >
              QUERO MINHA LISTA AGORA — R$19,90
            </button>
            <p
              style={{
                marginTop: "12px",
                textAlign: "center",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              🔒 Compra 100% segura • Acesso imediato • 7 dias de garantia
            </p>
          </div>
        </div>
      </div>

      {/* ── Barra fixa no rodapé ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#ea580c",
          padding: "12px 20px",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.15)",
          zIndex: 50,
        }}
      >
        <button
          onClick={() => {
            window.location.href = CHECKOUT_URL;
          }}
          style={{
            width: "100%",
            maxWidth: "480px",
            margin: "0 auto",
            display: "block",
            background: "#fff",
            color: "#ea580c",
            border: "none",
            borderRadius: "8px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 800,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          ACESSAR FORNECEDORES — R$19,90
        </button>
      </div>
    </div>
  );
}
