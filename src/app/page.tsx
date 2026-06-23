"use client";

import { useState, useEffect } from "react";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

/* ─── hooks ─────────────────────────────────────────────────── */

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

/* ─── dados ──────────────────────────────────────────────────── */

const categorias = [
  { emoji: "👗", label: "ROUPAS" },
  { emoji: "👙", label: "LINGERIE" },
  { emoji: "🌸", label: "PERFUMES" },
  { emoji: "💎", label: "BIJUTERIAS E SEMIJOIAS" },
  { emoji: "🧸", label: "BRINQUEDOS" },
  { emoji: "📦", label: "EMBALAGENS" },
  { emoji: "🎮", label: "GAMES" },
  { emoji: "📚", label: "PAPELARIA" },
  { emoji: "🍎", label: "ALIMENTOS" },
  { emoji: "🥤", label: "BEBIDAS" },
  { emoji: "🧹", label: "PRODUTOS DE LIMPEZA" },
  { emoji: "💊", label: "SUPLEMENTOS" },
];

const oquerecebes = [
  "180 fornecedores verificados — direto da fonte, no atacado",
  "Contato direto: site, WhatsApp e telefone de cada empresa",
  "12 categorias: Roupas, Lingerie, Perfumes, Bijuterias, Games, Papelaria, Suplementos e mais",
  "Marcas reais: Multilaser, Rovitex, Gimba, Inventa, Technos e muito mais",
  "Não precisa de CNPJ — compre como pessoa física",
  "Comece com menos de R$100 — sem pedido mínimo alto",
  "Envio para todo o Brasil — fornecedores de SP, RS, SC e todo o país",
  "Preços de atacado real — margem de 100% a 400% por produto",
];

const bonuses = [
  {
    n: "01",
    emoji: "🧮",
    title: "CALCULADORA DE PRECIFICAÇÃO",
    desc: "Descubra o preço ideal para cada produto e nunca mais venda no prejuízo. Informe o custo, a margem desejada e as taxas do marketplace — a calculadora faz tudo por você.",
    valor: "R$47",
  },
  {
    n: "02",
    emoji: "🏪",
    title: "GUIA LOJA DE 10",
    desc: "Aprenda a montar sua loja virtual do zero e faturar seus primeiros R$1.000 na primeira semana, mesmo sem experiência em vendas online.",
    valor: "R$37",
  },
  {
    n: "03",
    emoji: "🔥",
    title: "LISTA DOS PRODUTOS MAIS VENDIDOS",
    desc: "Os produtos que mais vendem agora no Mercado Livre, Shopee e Amazon — já com o fornecedor certo indicado dentro da lista.",
    valor: "R$37",
  },
  {
    n: "04",
    emoji: "📱",
    title: "PACOTE INFLUENCER PARA INSTAGRAM",
    desc: "Templates prontos para vender no Instagram sem precisar aparecer. Artes, legendas e estratégias para iniciantes conseguirem suas primeiras vendas.",
    valor: "R$57",
  },
  {
    n: "05",
    emoji: "📊",
    title: "CATÁLOGO DE TENDÊNCIAS",
    desc: "As tendências da próxima temporada para você comprar do fornecedor antes de todo mundo e vender com margem muito maior.",
    valor: "R$47",
  },
  {
    n: "06",
    emoji: "🤖",
    title: "COMO GERAR IMAGENS COM IA",
    desc: "Crie fotos profissionais dos seus produtos usando inteligência artificial, sem fotógrafo, sem modelo e sem gastar nada.",
    valor: "R$37",
  },
  {
    n: "07",
    emoji: "💬",
    title: "GRUPOS E COMUNIDADES NO WHATSAPP",
    desc: "Acesso a grupos e comunidades no WhatsApp com contato direto de fornecedores — tire dúvidas, negocie preços e receba novidades dos atacadistas em tempo real.",
    valor: "R$67",
  },
];

const depoimentos = [
  { texto: "Acabei de acessar a lista! Já to preparando meu primeiro pedido, muito obrigada 🥰", horario: "17:07" },
  { texto: "Pedi várias peças e realmente são muito baratas, já vendi mais da metade, obrigadas ✨", horario: "19:03" },
  { texto: "Entrei em contato com os fornecedores que eu queria e já estou no processo de compra. Me ajudou demaaais! 🙏", horario: "14:32" },
  { texto: "Tudo certinho Amei ✅\nMaterial perfeito\nTudo lindo 🌸", horario: "14:00" },
];

const faqs = [
  { q: "O que é a Lista de Fornecedores?", a: "É um arquivo digital com mais de 500 fornecedores verificados, com contato direto, categorias de produtos, condições de compra e forma de pagamento. Tudo que você precisa para começar a revender hoje mesmo." },
  { q: "Preciso de CNPJ para comprar dos fornecedores?", a: "Não! A maioria dos fornecedores da lista vende para pessoa física. Você consegue comprar com CPF mesmo, sem burocracia." },
  { q: "Com quanto capital posso começar?", a: "Com menos de R$100! A maioria dos fornecedores aceita pedidos pequenos — perfeitos para quem está começando e quer testar antes de investir mais." },
  { q: "Quais categorias têm na lista?", a: "Moda feminina, lingerie, calçados, moda praia, fitness, infantil, plus size, acessórios, bolsas, eletrônicos, casa e muito mais. A lista cobre todos os nichos que mais vendem no Mercado Livre, Amazon, Shopee e Facebook." },
  { q: "Como recebo o acesso após a compra?", a: "Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail. O acesso é vitalício." },
  { q: "Tem garantia?", a: "Sim. Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas e sem burocracia." },
  { q: "Posso vender nos marketplaces (Mercado Livre, Shopee, Amazon)?", a: "Com certeza! Os fornecedores da lista já foram selecionados pensando nos marketplaces. Você consegue margem suficiente para cobrir taxas e ainda lucrar bem." },
];

/* ─── ícones ─────────────────────────────────────────────────── */

function IconCheck({ size = 20, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
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

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "inline-block", border: "1.5px solid #ea580c", borderRadius: "100px", padding: "6px 18px", fontSize: "12px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.08em", marginBottom: "14px" }}>
      {children}
    </div>
  );
}

/* ─── Card de oferta (reutilizado no hero desktop e na seção de preço) ── */

function OfferCard({ email, setEmail, loading, submitted, erro, handleSubmit }: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  submitted: boolean;
  erro: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div style={{ border: "2px solid #ea580c", borderRadius: "16px", padding: "28px 20px", textAlign: "center", background: "#fff" }}>
      <div style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", padding: "4px 14px", borderRadius: "100px", marginBottom: "12px" }}>
        OFERTA EXCLUSIVA E LIMITADA
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: 900, marginBottom: "4px" }}>
        ACESSO COMPLETO À LISTA VIP<br />
        <span style={{ color: "#ea580c" }}>+ 7 BÔNUS EXCLUSIVOS</span>
      </h3>

      <p style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "line-through", margin: "12px 0 4px" }}>
        DE R$97,00 POR APENAS
      </p>

      {/* Preço à vista */}
      <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "12px", marginBottom: "12px" }}>
        <p style={{ fontSize: "42px", fontWeight: 900, color: "#ea580c", lineHeight: 1 }}>R$19,90</p>
        <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: 700 }}>À VISTA</p>
      </div>

      {/* OU */}
      <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>OU</p>

      {/* Parcelado */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#555", marginBottom: "2px" }}>EM ATÉ</p>
        <p style={{ fontSize: "36px", fontWeight: 900, color: "#ea580c", lineHeight: 1 }}>
          10X<span style={{ fontSize: "22px" }}> de </span>1,99
        </p>
        <p style={{ fontSize: "11px", color: "#ea580c", fontWeight: 700, marginTop: "2px" }}>
          NO CARTÃO. VOCÊ QUEM ESCOLHE!
        </p>
      </div>

      {/* Inclusões */}
      <div style={{ textAlign: "left", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {["180 fornecedores em 12 categorias", "7 bônus exclusivos", "Grupos WhatsApp com fornecedores", "Acesso imediato no seu e-mail", "Compra 100% segura"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#555" }}>
            <IconCheck size={14} />
            <span>{item}</span>
          </div>
        ))}
      </div>

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
            style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1.5px solid #d1d5db", fontSize: "15px", outline: "none", textAlign: "center", fontFamily: "inherit", boxSizing: "border-box" }}
          />
          {erro && <p style={{ fontSize: "12px", color: "#dc2626" }}>{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#fb923c" : "#22c55e", color: "#fff", border: "none", borderRadius: "10px", padding: "18px", fontSize: "16px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", fontFamily: "inherit" }}
          >
            {loading ? "PROCESSANDO..." : "LIBERAR MEU ACESSO →"}
          </button>
        </form>
      )}
      <p style={{ marginTop: "10px", fontSize: "10px", color: "#9ca3af" }}>🔒 Pagamento 100% seguro via Kiwify</p>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────────────── */

export default function FornecedoresPage() {
  const { h, m, s } = useCountdown(2 * 3600 + 47 * 60 + 33);
  const isMobile = useIsMobile();
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

  const maxW = isMobile ? 480 : 1100;
  const secPad = isMobile ? "40px 20px" : "60px 40px";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", color: "#111" }}>

      {/* ── Urgency bar ── */}
      <div style={{ background: "#ea580c", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: "13px", fontWeight: 700 }}>
        🔥 OFERTA ESPECIAL ENCERRA EM:{" "}
        <span style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "2px 8px", marginLeft: "6px", fontVariantNumeric: "tabular-nums" }}>
          {h}:{m}:{s}
        </span>
      </div>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #fff7ed 0%, #fff 60%)", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto" }}>

          {/* Logo */}
          <div style={{ textAlign: isMobile ? "center" : "left", marginBottom: "28px" }}>
            <span style={{ fontSize: "22px", fontWeight: 900, color: "#ea580c", letterSpacing: "-0.5px" }}>
              FORNECEDORES<span style={{ color: "#111" }}>VIP</span>
            </span>
          </div>

          {/* Desktop: 2 colunas | Mobile: coluna única */}
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>

            {/* Coluna esquerda — copy */}
            <div style={{ flex: isMobile ? undefined : "1 1 55%" }}>
              <h1 style={{ fontSize: isMobile ? "26px" : "38px", fontWeight: 900, lineHeight: 1.15, marginBottom: "16px", textAlign: isMobile ? "center" : "left" }}>
                <span style={{ color: "#ea580c" }}>180 FORNECEDORES VERIFICADOS</span>{" "}
                DIRETO DO ATACADO PARA VOCÊ REVENDER E LUCRAR DE VERDADE
              </h1>

              <p style={{ fontSize: isMobile ? "15px" : "17px", color: "#555", lineHeight: 1.6, marginBottom: "28px", textAlign: isMobile ? "center" : "left" }}>
                Acesse hoje a lista com os melhores fornecedores de moda, calçados, acessórios e muito mais — testados, verificados e prontos para você comprar sem CNPJ.
              </p>

              {/* Trust numbers */}
              <div style={{ display: "flex", gap: "32px", marginBottom: "28px", justifyContent: isMobile ? "center" : "flex-start" }}>
                {[{ n: "180", label: "Fornecedores" }, { n: "12", label: "Categorias" }, { n: "100%", label: "Verificados" }].map((item) => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, color: "#ea580c" }}>{item.n}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Benefits checklist no desktop */}
              {!isMobile && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {oquerecebes.slice(0, 5).map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <IconCheck size={18} />
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {isMobile && (
                <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ width: "100%", background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: "18px", fontSize: "16px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(234,88,12,0.35)", fontFamily: "inherit" }}>
                  QUERO ACESSAR AGORA →
                </button>
              )}
              {isMobile && <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>🔒 Pagamento 100% seguro • Acesso imediato • 7 dias de garantia</p>}
            </div>

            {/* Coluna direita — oferta card (só no desktop) */}
            {!isMobile && (
              <div style={{ flex: "0 0 380px" }}>
                <OfferCard email={email} setEmail={setEmail} loading={loading} submitted={submitted} erro={erro} handleSubmit={handleSubmit} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORIAS ── */}
      <div style={{ background: "#fff", padding: secPad, borderTop: "1px solid #f3f4f6" }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>O QUE VOCÊ ACESSA</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "6px", textTransform: "uppercase" }}>
            12 CATEGORIAS QUE VOCÊ PODE ACESSAR AINDA HOJE
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "28px", lineHeight: 1.5 }}>
            180 fornecedores verificados — de Roupas a Suplementos, do atacado direto para você
          </p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "12px" : "16px", marginBottom: "28px" }}>
            {categorias.map((cat) => (
              <div key={cat.label} style={{ border: "2px solid #ea580c", borderRadius: "12px", padding: isMobile ? "16px 8px 12px" : "20px 8px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", background: "#fff7ed" }}>
                <span style={{ fontSize: isMobile ? "28px" : "36px" }}>{cat.emoji}</span>
                <span style={{ fontSize: isMobile ? "9px" : "11px", fontWeight: 800, color: "#111", textAlign: "center", letterSpacing: "0.03em", lineHeight: 1.3 }}>
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO ACESSAR ESSAS CATEGORIAS
          </button>
        </div>
      </div>

      {/* ── O QUE VOCÊ VAI RECEBER ── */}
      <div style={{ background: "#fff7ed", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>CONTEÚDO</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
            ISSO TUDO POR MENOS DE 20 REAIS 🤩
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
            {oquerecebes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#fff", border: "1px solid #fed7aa", borderRadius: "10px", padding: "12px 14px", textAlign: "left" }}>
                <IconCheck />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>

          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO LIBERAR MEU ACESSO →
          </button>
        </div>
      </div>

      {/* ── COMPARAÇÃO ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>POR QUE A LISTA VIP?</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
            A DIFERENÇA É GRITANTE
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? "12px" : "24px", maxWidth: isMobile ? "100%" : "800px", margin: "0 auto 28px" }}>
            {/* SEM */}
            <div style={{ border: "2px solid #fecaca", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "#fee2e2", padding: "12px", fontWeight: 800, fontSize: isMobile ? "12px" : "14px", color: "#dc2626" }}>❌ SEM A LISTA</div>
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Compra no varejo e perde margem", "Não sabe onde achar fornecedor confiável", "Cai em golpe de fornecedor falso", "Acha que precisa de muito capital", "Fica travada sem saber por onde começar"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px", textAlign: "left" }}>
                    <IconX size={isMobile ? 14 : 16} />
                    <span style={{ fontSize: isMobile ? "11px" : "13px", color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COM */}
            <div style={{ border: "2px solid #86efac", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "#dcfce7", padding: "12px", fontWeight: 800, fontSize: isMobile ? "12px" : "14px", color: "#16a34a" }}>✅ COM A LISTA VIP</div>
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Compra no atacado com 100%+ de margem", "+500 fornecedores no bolso", "Todos verificados e aprovados", "Começa com menos de R$100", "Começa hoje mesmo, sem enrolação"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px", textAlign: "left" }}>
                    <IconCheck size={isMobile ? 14 : 16} />
                    <span style={{ fontSize: isMobile ? "11px" : "13px", color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO ACESSAR O MÉTODO AGORA →
          </button>
        </div>
      </div>

      {/* ── BÔNUS ── */}
      <div style={{ background: "linear-gradient(160deg, #fff7ed 0%, #fff 100%)", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>POR TEMPO LIMITADO</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "6px", textTransform: "uppercase" }}>
            ALÉM DA LISTA, VOCÊ AINDA RECEBE ESTES
          </h2>
          <h3 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 900, color: "#ea580c", marginBottom: "28px" }}>
            7 BÔNUS EXCLUSIVOS 🎁
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? "16px" : "24px", marginBottom: "20px" }}>
            {bonuses.map((b) => (
              <div key={b.n} style={{ border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {/* Mockup visual */}
                <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)", height: isMobile ? "110px" : "130px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ fontSize: isMobile ? "52px" : "64px" }}>{b.emoji}</div>
                  <div style={{ position: "absolute", top: "10px", right: "10px", background: "#ea580c", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.05em" }}>
                    GRÁTIS
                  </div>
                </div>
                {/* Conteúdo */}
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#ea580c", marginBottom: "4px", letterSpacing: "0.05em" }}>
                    🎁 BÔNUS {b.n}:
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "#111", marginBottom: "10px", lineHeight: 1.3 }}>{b.title}</div>
                  <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.6, marginBottom: "14px" }}>{b.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>De</span>
                    <span style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through", fontWeight: 600 }}>{b.valor}</span>
                    <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>por</span>
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#22c55e" }}>R$ 0,00</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#ea580c", borderRadius: "12px", padding: "14px 20px", color: "#fff", fontSize: isMobile ? "13px" : "15px", fontWeight: 700, marginBottom: "20px" }}>
            VALOR TOTAL DOS BÔNUS: R$329,00 — INCLUSO SEM CUSTO EXTRA 🎯
          </div>

          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO TUDO ISSO AGORA →
          </button>
        </div>
      </div>

      {/* ── DEPOIMENTOS ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>QUEM USA</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "6px" }}>
            Não precisa acreditar em mim!
          </h2>
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "28px", lineHeight: 1.6 }}>
            Mais de <strong>5.000 pessoas</strong> já usam nossa lista e transformaram seus negócios.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "16px", marginBottom: "24px" }}>
            {depoimentos.map((d, i) => (
              <div key={i} style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "12px", padding: "14px", textAlign: "left" }}>
                <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 700, marginBottom: "6px" }}>💬 {d.horario}</div>
                <p style={{ fontSize: isMobile ? "11px" : "12px", color: "#333", lineHeight: 1.5, whiteSpace: "pre-line" }}>{d.texto}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", padding: "16px", fontSize: isMobile ? "13px" : "15px", color: "#c2410c", fontWeight: 700, lineHeight: 1.5, maxWidth: isMobile ? "100%" : "600px", margin: "0 auto 24px" }}>
            Todo dia centenas de pessoas começam a vender usando nossa lista e{" "}
            <span style={{ color: "#ea580c" }}>chegam mais perto de realizar seu sonho de renda extra.</span>
          </div>

          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO FAZER PARTE →
          </button>
        </div>
      </div>

      {/* ── OFERTA / PREÇO ── */}
      <div style={{ background: "linear-gradient(160deg, #fff7ed 0%, #fff 100%)", padding: secPad }}>
        <div style={{ maxWidth: isMobile ? 480 : 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "16px" }}>🚀</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#ea580c" }}>ACESSO IMEDIATO APÓS O PAGAMENTO!</span>
          </div>
          <OfferCard email={email} setEmail={setEmail} loading={loading} submitted={submitted} erro={erro} handleSubmit={handleSubmit} />
        </div>
      </div>

      {/* ── GARANTIA ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: isMobile ? 480 : 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", background: "#ea580c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: "32px" }}>🛡️</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, marginBottom: "10px", color: "#ea580c" }}>
            Garantia Incondicional de 7 dias
          </h2>
          <p style={{ fontSize: isMobile ? "14px" : "16px", color: "#555", lineHeight: 1.6, marginBottom: "12px" }}>
            Teste a lista por 7 dias. Se você não ficar 100% satisfeita, devolvemos todo o seu dinheiro.
          </p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.05em", marginBottom: "24px" }}>
            SEM PERGUNTAS. SEM BUROCRACIA.
          </p>
          <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "16px" : "18px 48px", fontSize: isMobile ? "15px" : "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
            QUERO GARANTIR MEU ACESSO →
          </button>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: "#f9fafb", padding: `40px 20px ${isMobile ? "100px" : "80px"}` }}>
        <div style={{ maxWidth: isMobile ? 480 : 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
            Perguntas frequentes
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "8px", marginBottom: "32px" }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden", background: "#fff", alignSelf: "start" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontWeight: 700, fontSize: "13px", color: "#111", gap: "8px", fontFamily: "inherit" }}>
                  <span>{f.q}</span>
                  <IconChevron open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 16px 14px", fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: isMobile ? "18px" : "20px 64px", fontSize: isMobile ? "16px" : "18px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(234,88,12,0.35)", fontFamily: "inherit" }}>
              QUERO MINHA LISTA AGORA — R$19,90
            </button>
            <p style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#9ca3af" }}>
              🔒 Compra 100% segura • Acesso imediato • 7 dias de garantia
            </p>
          </div>
        </div>
      </div>

      {/* ── Barra fixa no rodapé ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#ea580c", padding: "12px 20px", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)", zIndex: 50 }}>
        <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ width: "100%", maxWidth: isMobile ? "480px" : "600px", margin: "0 auto", display: "block", background: "#fff", color: "#ea580c", border: "none", borderRadius: "8px", padding: "14px", fontSize: isMobile ? "15px" : "16px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "inherit" }}>
          ACESSAR FORNECEDORES — R$19,90
        </button>
      </div>
    </div>
  );
}
