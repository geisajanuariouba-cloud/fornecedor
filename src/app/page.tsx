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
  { label: "ROUPAS", img: "1567401893014-76bce522b35d", emoji: "👗" },
  { label: "LINGERIE", img: "1571513800374-841571dbcc4e", emoji: "👙" },
  { label: "ELETRÔNICOS E CELULARES", img: "1592899677977-9c10ca588bbd", emoji: "📱" },
  { label: "MAQUIAGEM E COSMÉTICOS", img: "1522335789203-aabd1fc54bc9", emoji: "💄" },
  { label: "PERFUMES", img: "1588776814546-daab30f310f4", emoji: "🌸" },
  { label: "BIJUTERIAS E SEMIJOIAS", img: "1515562141207-7a88fb7ce338", emoji: "💎" },
  { label: "BRINQUEDOS", img: "1596461404969-9ae70f2830c1", emoji: "🧸" },
  { label: "EMBALAGENS", img: "1586528116311-ad8dd3c8310d", emoji: "📦" },
  { label: "GAMES", img: "1552820728-8b83bb6b773f", emoji: "🎮" },
  { label: "PAPELARIA", img: "1456735190827-d1262f71b8a3", emoji: "📚" },
  { label: "ALIMENTOS", img: "1498837167922-ddd27525d352", emoji: "🍎" },
  { label: "BEBIDAS", img: "1544145945-f90425340c7e", emoji: "🥤" },
  { label: "PRODUTOS DE LIMPEZA", img: "1563453392212-326f5e854473", emoji: "🧹" },
  { label: "SUPLEMENTOS", img: "1517836357463-d25dfeac3438", emoji: "💊" },
];

const oquerecebes = [
  "180 fornecedores verificados — direto da fonte, no atacado",
  "Contato direto: site, WhatsApp e telefone de cada empresa",
  "14 categorias: Roupas, Lingerie, Eletrônicos, Maquiagem, Perfumes, Bijuterias, Games e mais",
  "Marcas reais: Multilaser, RCell, Rovitex, Gimba, Inventa, Technos e muito mais",
  "Não precisa de CNPJ — compre como pessoa física",
  "Comece com menos de R$100 — sem pedido mínimo alto",
  "Envio para todo o Brasil — fornecedores de SP, RS, SC e todo o país",
  "Preços de atacado real — margem de 100% a 400% por produto",
];

const compostoItems = [
  "Nome da empresa + site oficial para compra direta",
  "WhatsApp ou telefone de contato do fornecedor",
  "Categoria de produto e faixa de preço no atacado",
  "Pedido mínimo e formas de pagamento aceitas",
  "Informação se vende para pessoa física (CPF) ou só CNPJ",
  "Avaliação de confiabilidade — só fornecedores testados",
];

const bonuses = [
  {
    n: "01", emoji: "🏪",
    title: "GUIA LOJA DE 10",
    desc: "Aprenda a montar sua loja virtual do zero e faturar seus primeiros R$1.000 na primeira semana, mesmo sem experiência em vendas online.",
    valor: "R$37",
  },
  {
    n: "02", emoji: "🔥",
    title: "LISTA DOS PRODUTOS MAIS VENDIDOS",
    desc: "Os produtos que mais vendem agora no Mercado Livre, Shopee e Amazon — já com o fornecedor certo indicado dentro da lista.",
    valor: "R$37",
  },
  {
    n: "03", emoji: "📸",
    title: "PACOTE INFLUENCER PARA INSTAGRAM",
    desc: "Templates prontos para vender no Instagram sem precisar aparecer. Artes, legendas e estratégias para iniciantes conseguirem suas primeiras vendas.",
    valor: "R$57",
  },
  {
    n: "04", emoji: "📊",
    title: "CATÁLOGO DE TENDÊNCIAS",
    desc: "As tendências da próxima temporada para você comprar do fornecedor antes de todo mundo e vender com margem muito maior.",
    valor: "R$47",
  },
  {
    n: "05", emoji: "🤖",
    title: "COMO GERAR IMAGENS COM IA",
    desc: "Crie fotos profissionais dos seus produtos usando inteligência artificial, sem fotógrafo, sem modelo e sem gastar nada.",
    valor: "R$37",
  },
  {
    n: "06", emoji: "💬",
    title: "GRUPOS E COMUNIDADES NO WHATSAPP",
    desc: "Acesso a grupos e comunidades no WhatsApp com contato direto de fornecedores — tire dúvidas, negocie preços e receba novidades dos atacadistas em tempo real.",
    valor: "R$67",
  },
];

const depoimentos = [
  {
    tipo: "whatsapp",
    nome: "Sabrina",
    msgs: [
      { lado: "left", texto: "Acabei de acessar 🙌", hora: "17:07" },
      { lado: "left", texto: "Já tô preparando para fazer meu primeiro pedido, muito obrigada ✨✨", hora: "17:07" },
    ],
  },
  {
    tipo: "whatsapp",
    nome: "Priscila",
    msgs: [
      { lado: "left", texto: "Pedi vários peças e realmente são muito baratas, e já vendi mais da metade, obrigadas🙏", hora: "22:11" },
      { lado: "right", texto: "Fico muito feliz por você 🙏🙏", hora: "22:12" },
    ],
  },
  {
    tipo: "whatsapp",
    nome: "Camila",
    msgs: [
      { lado: "right", texto: "Que achou da lista? Tenha você comprou?", hora: "18:47" },
      { lado: "left", texto: "Oi Camila", hora: "18:48" },
      { lado: "left", texto: "É amor viu?", hora: "18:48" },
      { lado: "left", texto: "Já entrei em contato com os fornecedores que eu queria e já estou no processo de compra", hora: "18:49" },
      { lado: "left", texto: "Muito obrigada, me ajudou demaaaaais 💗", hora: "18:49" },
      { lado: "right", texto: "Nossas, fico muito feliz em saber 😊", hora: "18:50" },
      { lado: "right", texto: "Qualquer dúvida pode me perguntar viu!", hora: "18:50" },
    ],
  },
  {
    tipo: "whatsapp",
    nome: "Cliente",
    hasProductImage: true,
    msgs: [
      { lado: "left", texto: "Tudo certinho amei 😍", hora: "13:01" },
      { lado: "left", texto: "Material perfeito", hora: "14:08" },
      { lado: "left", texto: "Tudo lindo", hora: "19:00" },
    ],
  },
];

const faqs = [
  { q: "O que é a Lista de Fornecedores?", a: "É um arquivo digital com 180 fornecedores verificados, com contato direto, categorias de produtos, condições de compra e forma de pagamento. Tudo que você precisa para começar a revender hoje mesmo." },
  { q: "Preciso de CNPJ para comprar dos fornecedores?", a: "Não! A maioria dos fornecedores da lista vende para pessoa física. Você consegue comprar com CPF mesmo, sem burocracia." },
  { q: "Com quanto capital posso começar?", a: "Com menos de R$100! A maioria dos fornecedores aceita pedidos pequenos — perfeitos para quem está começando e quer testar antes de investir mais." },
  { q: "Quais categorias têm na lista?", a: "Roupas, Lingerie, Eletrônicos e Celulares, Maquiagem e Cosméticos, Perfumes, Bijuterias e Semijoias, Brinquedos, Embalagens, Games, Papelaria, Alimentos, Bebidas, Produtos de Limpeza e Suplementos. 180 fornecedores em 14 categorias." },
  { q: "Como recebo o acesso após a compra?", a: "Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail. O acesso é vitalício." },
  { q: "Tem garantia?", a: "Sim. Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas e sem burocracia." },
  { q: "Posso vender nos marketplaces (Mercado Livre, Shopee, Amazon)?", a: "Com certeza! Os fornecedores da lista foram selecionados pensando nos marketplaces. Você consegue margem suficiente para cobrir taxas e ainda lucrar bem." },
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

function IconX({ size = 16 }: { size?: number }) {
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

function CTAButton({ children, large, fullWidth }: { children: React.ReactNode; large?: boolean; fullWidth?: boolean }) {
  return (
    <button
      onClick={() => { window.location.href = CHECKOUT_URL; }}
      style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: "12px", padding: large ? "20px 56px" : "16px 32px", fontSize: large ? "18px" : "15px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(234,88,12,0.35)", fontFamily: "inherit", width: fullWidth ? "100%" : undefined }}
    >
      {children}
    </button>
  );
}

/* ─── Countdown box ─────────────────────────────────────────── */

function CountdownBox({ h, m, s }: { h: string; m: string; s: string }) {
  const boxStyle: React.CSSProperties = { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "8px 14px", textAlign: "center", minWidth: "52px" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
      {[{ v: h, l: "Horas" }, { v: m, l: "Minutos" }, { v: s, l: "Segundos" }].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={boxStyle}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#ea580c", fontVariantNumeric: "tabular-nums" }}>{item.v}</div>
            <div style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 600 }}>{item.l}</div>
          </div>
          {i < 2 && <span style={{ fontSize: "20px", fontWeight: 900, color: "#ea580c" }}>:</span>}
        </div>
      ))}
    </div>
  );
}

/* ─── WhatsApp Chat Card ────────────────────────────────────── */

function WhatsAppCard({ dep }: { dep: typeof depoimentos[0] }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.18)", border: "1px solid #ccc" }}>
      {/* status bar */}
      <div style={{ background: "#128c7e", padding: "3px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <svg width="12" height="10" viewBox="0 0 12 10"><rect x="0" y="5" width="2" height="5" fill="white"/><rect x="3" y="3" width="2" height="7" fill="white"/><rect x="6" y="1" width="2" height="9" fill="white"/><rect x="9" y="0" width="2" height="10" fill="white" opacity="0.4"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><rect x="1" y="2" width="10" height="7" rx="1" fill="none" stroke="white" strokeWidth="1.2"/><rect x="2" y="3" width="7" height="5" fill="white"/><rect x="11.5" y="4" width="1.5" height="3" rx="0.5" fill="white"/></svg>
        </div>
      </div>
      {/* header */}
      <div style={{ background: "#128c7e", padding: "8px 12px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="white"><path d="M8 1L2 8L8 15"/></svg>
        <div style={{ width: "36px", height: "36px", background: "#7c9ea9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700, lineHeight: 1.2 }}>{dep.nome}</div>
          <div style={{ color: "#b2dfdb", fontSize: "10px" }}>online</div>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.87a19.79 19.79 0 01-3.07-8.67A2 2 0 012.78 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8.55a16 16 0 006.29 6.29l.96-.95a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <svg width="18" height="12" viewBox="0 0 24 16" fill="white"><circle cx="5" cy="8" r="3"/><circle cx="12" cy="8" r="3"/><circle cx="19" cy="8" r="3"/></svg>
        </div>
      </div>
      {/* chat area */}
      <div style={{ background: "#e5ddd5", padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: "4px", minHeight: "120px" }}>
        {dep.hasProductImage && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "2px" }}>
            <div style={{ background: "#fff", borderRadius: "8px", padding: "3px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)", maxWidth: "65%" }}>
              {!imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="https://images.unsplash.com/photo-1558618047-3c4ed15c5a9a?w=180&h=120&fit=crop&auto=format"
                  alt="produto"
                  style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "6px", display: "block" }}
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div style={{ width: "150px", height: "100px", background: "#ddd", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>📦</div>
              )}
            </div>
          </div>
        )}
        {dep.msgs?.map((msg, j) => (
          <div key={j} style={{ display: "flex", justifyContent: msg.lado === "right" ? "flex-end" : "flex-start" }}>
            <div style={{
              background: msg.lado === "right" ? "#dcf8c6" : "#fff",
              borderRadius: msg.lado === "right" ? "8px 1px 8px 8px" : "1px 8px 8px 8px",
              padding: "6px 8px 3px",
              maxWidth: "82%",
              boxShadow: "0 1px 1px rgba(0,0,0,0.13)",
            }}>
              <p style={{ fontSize: "12px", color: "#111", margin: 0, lineHeight: 1.45, wordBreak: "break-word" }}>{msg.texto}</p>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "3px", marginTop: "1px" }}>
                <span style={{ fontSize: "9px", color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{msg.hora}</span>
                {msg.lado === "right" && (
                  <svg width="14" height="9" viewBox="0 0 16 10" fill="#53bdeb">
                    <path d="M1 5l3 3 5-6M6 5l3 3 5-6" strokeWidth="0.5" stroke="#53bdeb"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* input bar */}
      <div style={{ background: "#f0f0f0", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: "20px", padding: "6px 14px", fontSize: "11px", color: "#aaa" }}>Mensagem</div>
        <div style={{ width: "30px", height: "30px", background: "#25d366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Category Card ─────────────────────────────────────────── */

function CatCard({ cat, isMobile }: { cat: typeof categorias[0]; isMobile: boolean }) {
  const [failed, setFailed] = useState(false);
  const imgSize = isMobile ? 90 : 120;
  return (
    <div style={{ border: "2.5px solid #e879a0", borderRadius: "14px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", height: isMobile ? 90 : 120, overflow: "hidden", position: "relative" }}>
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://images.unsplash.com/photo-${cat.img}?w=${imgSize * 2}&h=${imgSize * 2}&fit=crop&auto=format&q=70`}
            alt={cat.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "36px" : "48px" }}>
            {cat.emoji}
          </div>
        )}
      </div>
      <div style={{ padding: "6px 4px 8px", textAlign: "center" }}>
        <span style={{ fontSize: isMobile ? "9px" : "10px", fontWeight: 800, color: "#111", letterSpacing: "0.02em", lineHeight: 1.3 }}>{cat.label}</span>
      </div>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────────────── */

export default function FornecedoresPage() {
  const { h, m, s } = useCountdown(2 * 3600 + 47 * 60 + 33);
  const isMobile = useIsMobile();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const maxW = isMobile ? 480 : 1100;
  const secPad = isMobile ? "40px 20px" : "64px 40px";

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
          <div style={{ textAlign: isMobile ? "center" : "left", marginBottom: "28px" }}>
            <span style={{ fontSize: "22px", fontWeight: 900, color: "#ea580c", letterSpacing: "-0.5px" }}>
              Fornecedor<span style={{ color: "#111" }}>Vip</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: "56px", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>
            {/* Coluna esquerda */}
            <div style={{ flex: isMobile ? undefined : "1 1 55%" }}>
              <h1 style={{ fontSize: isMobile ? "26px" : "40px", fontWeight: 900, lineHeight: 1.15, marginBottom: "16px", textAlign: isMobile ? "center" : "left" }}>
                <span style={{ color: "#ea580c" }}>180 FORNECEDORES VERIFICADOS</span>{" "}
                DIRETO DO ATACADO PARA VOCÊ REVENDER E LUCRAR DE VERDADE
              </h1>
              <p style={{ fontSize: isMobile ? "15px" : "17px", color: "#555", lineHeight: 1.6, marginBottom: "28px", textAlign: isMobile ? "center" : "left" }}>
                Acesse hoje a lista com os melhores fornecedores de roupas, perfumes, bijuterias, games, suplementos e muito mais — testados, verificados e prontos para você comprar sem CNPJ.
              </p>

              <div style={{ display: "flex", gap: "32px", marginBottom: "28px", justifyContent: isMobile ? "center" : "flex-start" }}>
                {[{ n: "180", label: "Fornecedores" }, { n: "14", label: "Categorias" }, { n: "100%", label: "Verificados" }].map((item) => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 900, color: "#ea580c" }}>{item.n}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>{item.label}</div>
                  </div>
                ))}
              </div>

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

              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <CTAButton large={!isMobile} fullWidth={isMobile}>QUERO ACESSAR AGORA →</CTAButton>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>🔒 Pagamento seguro • Acesso imediato • 7 dias de garantia</p>
              </div>
            </div>

            {/* Coluna direita — card oferta desktop */}
            {!isMobile && (
              <div style={{ flex: "0 0 360px" }}>
                <div style={{ border: "2px solid #ea580c", borderRadius: "16px", padding: "24px 20px", background: "#fff" }}>
                  <div style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 14px", borderRadius: "100px", marginBottom: "12px" }}>OFERTA EXCLUSIVA E LIMITADA</div>
                  <div style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through", marginBottom: "4px" }}>DE R$97,00 POR APENAS</div>
                  <div style={{ fontSize: "46px", fontWeight: 900, color: "#ea580c", lineHeight: 1, marginBottom: "2px" }}>R$9,90</div>
                  <div style={{ fontSize: "13px", color: "#22c55e", fontWeight: 700, marginBottom: "16px" }}>PAGAMENTO ÚNICO • ACESSO VITALÍCIO</div>
                  {["180 fornecedores em 14 categorias", "6 bônus exclusivos", "Grupos WhatsApp com fornecedores", "Acesso imediato no e-mail"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", marginBottom: "6px" }}>
                      <IconCheck size={14} /><span>{item}</span>
                    </div>
                  ))}
                  <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ width: "100%", background: "#22c55e", color: "#fff", border: "none", borderRadius: "10px", padding: "16px", fontSize: "15px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit", marginTop: "14px", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
                    LIBERAR MEU ACESSO →
                  </button>
                  <p style={{ textAlign: "center", fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>🔒 Kiwify • 100% seguro</p>
                </div>
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
            14 CATEGORIAS QUE VOCÊ PODE ACESSAR AINDA HOJE
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "28px" }}>
            180 fornecedores verificados — de Roupas a Suplementos, do atacado direto para você
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "12px" : "16px", marginBottom: "28px" }}>
            {categorias.map((cat) => (
              <CatCard key={cat.label} cat={cat} isMobile={isMobile} />
            ))}
          </div>
          <CTAButton fullWidth={isMobile}>QUERO ACESSAR ESSAS CATEGORIAS</CTAButton>
        </div>
      </div>

      {/* ── CADA FORNECEDOR TEM ── */}
      <div style={{ background: "#fff7ed", padding: secPad }}>
        <div style={{ maxWidth: isMobile ? 480 : 700, margin: "0 auto" }}>
          <div style={{ background: "#fff", border: "1px solid #fed7aa", borderRadius: "16px", padding: isMobile ? "28px 20px" : "36px 40px" }}>
            <h2 style={{ textAlign: "center", fontSize: isMobile ? "18px" : "24px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
              CADA FORNECEDOR DA LISTA TEM:
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
              {compostoItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ color: "#ea580c", fontSize: "18px", flexShrink: 0, lineHeight: 1.4 }}>★</span>
                  <span style={{ fontSize: isMobile ? "13px" : "15px", color: "#333", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <CTAButton fullWidth={isMobile}>QUERO MINHA LISTA AGORA</CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── O QUE VOCÊ VAI RECEBER ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>CONTEÚDO</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
            ISSO TUDO POR MENOS DE 10 REAIS 🤩
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
            {oquerecebes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "12px 14px", textAlign: "left" }}>
                <IconCheck />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
          <CTAButton fullWidth={isMobile}>QUERO LIBERAR MEU ACESSO →</CTAButton>
        </div>
      </div>

      {/* ── COMPARAÇÃO ── */}
      <div style={{ background: "#f9fafb", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <PillLabel>POR QUE A LISTA VIP?</PillLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase" }}>
            A DIFERENÇA É GRITANTE
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? "12px" : "24px", maxWidth: isMobile ? "100%" : "800px", margin: "0 auto 28px" }}>
            <div style={{ border: "2px solid #fecaca", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "#fee2e2", padding: "12px", fontWeight: 800, fontSize: isMobile ? "12px" : "14px", color: "#dc2626" }}>❌ SEM A LISTA</div>
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Compra no varejo e perde margem", "Não sabe onde achar fornecedor confiável", "Risco de cair em golpe", "Acha que precisa de muito capital", "Fica travada sem saber por onde começar"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px", textAlign: "left" }}>
                    <IconX size={isMobile ? 14 : 16} />
                    <span style={{ fontSize: isMobile ? "11px" : "13px", color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "2px solid #86efac", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "#dcfce7", padding: "12px", fontWeight: 800, fontSize: isMobile ? "12px" : "14px", color: "#16a34a" }}>✅ COM A LISTA VIP</div>
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Compra no atacado com 100%+ de margem", "180 fornecedores verificados no bolso", "Todos testados e aprovados", "Começa com menos de R$100", "Começa hoje mesmo, sem enrolação"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px", textAlign: "left" }}>
                    <IconCheck size={isMobile ? 14 : 16} />
                    <span style={{ fontSize: isMobile ? "11px" : "13px", color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CTAButton fullWidth={isMobile}>QUERO ACESSAR O MÉTODO AGORA →</CTAButton>
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
            6 BÔNUS EXCLUSIVOS 🎁
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? "16px" : "24px", marginBottom: "20px" }}>
            {bonuses.map((b) => (
              <div key={b.n} style={{ border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)", height: isMobile ? "110px" : "130px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ fontSize: isMobile ? "52px" : "64px" }}>{b.emoji}</div>
                  <div style={{ position: "absolute", top: "10px", right: "10px", background: "#ea580c", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 10px", borderRadius: "100px" }}>GRÁTIS</div>
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#ea580c", marginBottom: "4px" }}>🎁 BÔNUS {b.n}:</div>
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
            VALOR TOTAL DOS BÔNUS: R$282,00 — INCLUSO SEM CUSTO EXTRA 🎯
          </div>
          <CTAButton fullWidth={isMobile}>QUERO TUDO ISSO AGORA →</CTAButton>
        </div>
      </div>

      {/* ── DEPOIMENTOS ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <PillLabel>QUEM USA</PillLabel>
            <h2 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: 900, marginBottom: "8px" }}>
              DEPOIMENTOS DE QUEM JÁ UTILIZOU A LISTA
            </h2>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Mais de <strong>5.000 pessoas</strong> já transformaram seus negócios com a lista.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? "16px" : "20px", marginBottom: "28px" }}>
            {depoimentos.map((dep, i) => (
              <WhatsAppCard key={i} dep={dep} />
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <CTAButton fullWidth={isMobile}>QUERO FAZER PARTE →</CTAButton>
          </div>
        </div>
      </div>

      {/* ── OFERTA EXCLUSIVA (seção grande) ── */}
      <div style={{ background: "linear-gradient(160deg, #fff7ed 0%, #fff 100%)", padding: secPad }}>
        <div style={{ maxWidth: maxW, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "56px", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>

            {/* Esquerda — pergunta + mockup */}
            <div style={{ flex: isMobile ? undefined : "1 1 42%", textAlign: "center" }}>
              <h2 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 900, lineHeight: 1.3, marginBottom: "28px", color: "#111" }}>
                Quanto valeria para você ter acesso a 180 fornecedores verificados e nunca mais depender de preço de varejo?
              </h2>
              <div style={{ background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", borderRadius: "20px", padding: "32px 24px", color: "#fff", marginBottom: "16px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
                <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "4px" }}>LISTA VIP</div>
                <div style={{ fontSize: "13px", opacity: 0.85 }}>180 Fornecedores Verificados</div>
                <div style={{ fontSize: "13px", opacity: 0.85 }}>14 Categorias • Atacado direto</div>
                <div style={{ marginTop: "16px", fontSize: "11px", opacity: 0.7, fontWeight: 700 }}>+ 6 BÔNUS EXCLUSIVOS</div>
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>Acesso imediato após a compra</p>
            </div>

            {/* Direita — oferta */}
            <div style={{ flex: isMobile ? undefined : "1 1 55%", width: isMobile ? "100%" : undefined }}>
              <div style={{ border: "2px solid #ea580c", borderRadius: "20px", padding: isMobile ? "24px 20px" : "36px 32px", background: "#fff" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "5px 16px", borderRadius: "100px", marginBottom: "14px" }}>OFERTA EXCLUSIVA</div>
                  <h3 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 900, marginBottom: "4px" }}>
                    ACESSO COMPLETO À LISTA VIP<br />
                    <span style={{ color: "#ea580c" }}>+ 6 BÔNUS EXCLUSIVOS</span>
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "20px" }}>
                  {[
                    { bold: "180 fornecedores verificados", rest: " em 14 categorias — contato direto" },
                    { bold: "Atacado real", rest: " — margem de 100% a 400% por produto" },
                    { bold: "Sem CNPJ", rest: " — pode comprar como pessoa física" },
                    { bold: "Bônus 01–02", rest: " — Guia Loja de 10 + Produtos mais vendidos" },
                    { bold: "Bônus 03–04", rest: " — Instagram + Catálogo de Tendências" },
                    { bold: "Bônus 05–06", rest: " — Imagens com IA + Grupos WhatsApp" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <IconCheck size={16} color="#ea580c" />
                      <span style={{ fontSize: "13px" }}><strong>{item.bold}</strong>{item.rest}</span>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through", marginBottom: "4px" }}>De R$197,00 por apenas:</div>
                  <div style={{ fontSize: isMobile ? "42px" : "52px", fontWeight: 900, color: "#ea580c", lineHeight: 1 }}>R$9,90</div>
                  <div style={{ fontSize: "13px", color: "#22c55e", fontWeight: 700, marginTop: "6px" }}>PAGAMENTO ÚNICO • ACESSO VITALÍCIO</div>
                </div>

                <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ width: "100%", background: "#22c55e", color: "#fff", border: "none", borderRadius: "12px", padding: "18px", fontSize: "17px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", marginBottom: "12px" }}>
                  QUERO ACESSAR AGORA!
                </button>
                <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
                  Você ficará um passo mais perto de realizar seu sonho 🎯
                </p>

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "12px", color: "#ea580c", fontWeight: 700, marginBottom: "10px" }}>⏳ Esta oferta expira em:</p>
                  <CountdownBox h={h} m={m} s={s} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GARANTIA ── */}
      <div style={{ background: "#fff", padding: secPad }}>
        <div style={{ maxWidth: isMobile ? 480 : 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", background: "#ea580c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: "32px" }}>🛡️</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, marginBottom: "10px", color: "#ea580c" }}>Garantia Incondicional de 7 dias</h2>
          <p style={{ fontSize: isMobile ? "14px" : "16px", color: "#555", lineHeight: 1.6, marginBottom: "12px" }}>
            Teste a lista por 7 dias. Se você não ficar 100% satisfeita, devolvemos todo o seu dinheiro.
          </p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.05em", marginBottom: "24px" }}>SEM PERGUNTAS. SEM BUROCRACIA.</p>
          <CTAButton large={!isMobile} fullWidth={isMobile}>QUERO GARANTIR MEU ACESSO →</CTAButton>
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
                {openFaq === i && <div style={{ padding: "0 16px 14px", fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{f.a}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <CTAButton large={!isMobile} fullWidth={isMobile}>QUERO MINHA LISTA AGORA — R$9,90</CTAButton>
            <p style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#9ca3af" }}>🔒 Compra 100% segura • Acesso imediato • 7 dias de garantia</p>
          </div>
        </div>
      </div>

      {/* ── Barra fixa ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#ea580c", padding: "12px 20px", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)", zIndex: 50 }}>
        <button onClick={() => { window.location.href = CHECKOUT_URL; }} style={{ width: "100%", maxWidth: isMobile ? "480px" : "600px", margin: "0 auto", display: "block", background: "#fff", color: "#ea580c", border: "none", borderRadius: "8px", padding: "14px", fontSize: isMobile ? "15px" : "16px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "inherit" }}>
          ACESSAR FORNECEDORES — R$9,90
        </button>
      </div>
    </div>
  );
}
