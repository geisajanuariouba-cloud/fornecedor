// Servidor — zero JS obrigatório. Cada opção é um <a href> normal.
// Funciona em qualquer celular/browser sem hidratação React.
export const dynamic = "force-dynamic";

import { CheckoutBtn, QuizViewContent } from "./checkout-btn";
import { supabaseAdmin } from "@/lib/supabase";

const CHECKOUT_URL = "https://pay.wiapy.com/lzRXtuSG_Ku";

/* ─── dados ─────────────────────────────────────────────────── */

const CATEGORIAS: Record<string, { fornecedores: number; margem: string; exemplo: string }> = {
  "Roupas e Lingerie":          { fornecedores: 38, margem: "150% a 350%", exemplo: "Camiseta por R$14 no atacado — vende por R$49,90" },
  "Maquiagem e Cosméticos":     { fornecedores: 24, margem: "200% a 400%", exemplo: "Kit maquiagem por R$22 — vende por R$89" },
  "Eletrônicos e Acessórios":   { fornecedores: 31, margem: "100% a 250%", exemplo: "Fone bluetooth por R$18 — vende por R$59,90" },
  "Games e Brinquedos":         { fornecedores: 22, margem: "120% a 300%", exemplo: "Controle por R$25 — vende por R$79,90" },
  "Alimentos e Suplementos":    { fornecedores: 19, margem: "100% a 200%", exemplo: "Whey 1kg por R$45 — vende por R$119" },
  "Bijuterias e Semijoias":     { fornecedores: 27, margem: "300% a 400%", exemplo: "Brinco por R$4 — vende por R$19,90" },
};

/* ─── helpers ───────────────────────────────────────────────── */

type Q = Record<string, string>;

function nextUrl(base: Q, step: number, extra?: Record<string, string>) {
  const p = new URLSearchParams({ ...base, ...extra, s: String(step) });
  return `/oferta?${p.toString()}`;
}

async function track(sid: string, step: number, stepName: string, answers: Q) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("[quiz-track debug] url:", url, "key:", key ? key.slice(0,10)+"..." : "MISSING");
  try {
    const { error } = await supabaseAdmin.from("quiz_sessions").upsert(
      { session_id: sid, step, step_name: stepName, answers, updated_at: new Date().toISOString() },
      { onConflict: "session_id" }
    );
    if (error) console.error("[quiz-track error]", error);
    else console.log("[quiz-track ok] step", step);
  } catch (e) { console.error("[quiz-track]", e); }
}

/* ─── estilos reutilizáveis ─────────────────────────────────── */

const btn = (orange?: boolean): React.CSSProperties => ({
  display: "block", width: "100%", boxSizing: "border-box",
  background: orange ? "#ea580c" : "#fff",
  color: orange ? "#fff" : "#111",
  border: orange ? "none" : "2px solid #e5e7eb",
  borderRadius: "12px", padding: "16px",
  fontSize: "15px", fontWeight: 700,
  textDecoration: "none", textAlign: "center",
  fontFamily: "Inter, sans-serif",
  boxShadow: orange ? "0 4px 16px rgba(234,88,12,0.3)" : "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  touchAction: "manipulation",
  cursor: "pointer",
  lineHeight: "1.3",
  minHeight: "52px",
  letterSpacing: "0.3px",
});

const optBtn = (): React.CSSProperties => ({
  display: "block", width: "100%", boxSizing: "border-box",
  background: "#fff", border: "2px solid #e5e7eb",
  borderRadius: "10px", padding: "16px",
  fontSize: "15px", fontWeight: 600, color: "#111",
  textDecoration: "none", textAlign: "left",
  fontFamily: "Inter, sans-serif",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  touchAction: "manipulation",
  lineHeight: "1.3",
  minHeight: "52px",
});

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #e5e7eb",
  borderRadius: "16px", padding: "24px 18px",
};

const pill: React.CSSProperties = {
  display: "inline-block", background: "#fff7ed",
  border: "1px solid #fed7aa", borderRadius: "100px",
  padding: "5px 14px", fontSize: "12px", fontWeight: 700,
  color: "#ea580c", marginBottom: "14px",
};

/* ─── página ────────────────────────────────────────────────── */

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const s = Number(params.s ?? 0);

  // session_id persiste na URL durante todo o quiz
  const sid = params.sid ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const q: Q = { sid, ...Object.fromEntries(Object.entries(params).filter(([k]) => k !== "s")) };

  // rastreamento server-side
  const stepNames = ["capa","q1","transicao1","q2","dado","depoimentos","q3","q4","q5","q6","loading","resultado"];
  await track(sid, s, stepNames[s] ?? `step_${s}`, q);

  const wrap: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    background: "#f9fafb",
    minHeight: "100vh",
    color: "#111",
  };
  const inner: React.CSSProperties = {
    maxWidth: "480px", margin: "0 auto", padding: "20px 16px 90px",
  };

  const TOTAL_Q = 6;
  function Progress({ n }: { n: number }) {
    const pct = Math.round((n / TOTAL_Q) * 100);
    return (
      <div>
        <div style={{ width:"100%", background:"#f3f4f6", height:"6px", borderRadius:"100px", marginBottom:"20px" }}>
          <div style={{ width:`${pct}%`, background:"#ea580c", height:"100%", borderRadius:"100px" }} />
        </div>
        <p style={{ fontSize:"11px", color:"#9ca3af", fontWeight:600, marginBottom:"10px" }}>PERGUNTA {n} DE {TOTAL_Q}</p>
      </div>
    );
  }

  // ── CAPA (s=0) ──────────────────────────────────────────────
  if (s === 0) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <div style={card}>
          <div style={pill}>🎯 TESTE RÁPIDO • 2 MINUTOS</div>
          <h1 style={{ fontSize:"22px", fontWeight:900, lineHeight:1.2, marginBottom:"14px" }}>
            Descubra quais fornecedores combinam com o que você quer vender
          </h1>
          <p style={{ fontSize:"14px", color:"#555", lineHeight:1.6, marginBottom:"22px" }}>
            Responda 6 perguntas e veja onde comprar com margem de até 400% — sem CNPJ, começando com menos de R$100.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"22px" }}>
            {["✅ Sem precisar de CNPJ","✅ Começando com menos de R$100","✅ Fornecedores verificados e testados"].map(t=>(
              <div key={t} style={{ fontSize:"13px", fontWeight:600, color:"#333" }}>{t}</div>
            ))}
          </div>
          <a href={nextUrl(q, 1)} style={btn(true)}>COMEÇAR O TESTE →</a>
          <p style={{ textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"10px" }}>🔒 Gratuito • Resultado na hora</p>
        </div>
      </div>
    </div>
  );

  // ── Q1 (s=1) — experiência ───────────────────────────────────
  if (s === 1) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={1} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"20px" }}>
          Você já tentou revender algum produto?
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {[
            ["Sim, já vendo ou já vendi","sim"],
            ["Tentei mas travei em algum ponto","tentei"],
            ["Ainda não, mas quero começar","nao"],
            ["Tenho interesse mas estou pesquisando","pesquisando"],
          ].map(([label, val]) => (
            <a key={val} href={nextUrl(q, 2, { q1: val })} style={optBtn()}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TRANSIÇÃO 1 (s=2) ────────────────────────────────────────
  if (s === 2) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <div style={{ ...card, background:"#fff7ed", border:"1px solid #fed7aa", textAlign:"center" }}>
          <div style={{ fontSize:"36px", marginBottom:"12px" }}>💡</div>
          <p style={{ fontSize:"15px", fontWeight:700, marginBottom:"10px" }}>Entendido.</p>
          <p style={{ fontSize:"14px", color:"#555", lineHeight:1.6, marginBottom:"20px" }}>
            O problema mais comum é pagar preço de varejo quando poderia comprar direto da fonte com <strong>margem de 100% a 400%</strong>.
          </p>
          <p style={{ fontSize:"13px", color:"#ea580c", fontWeight:700, marginBottom:"22px" }}>
            Continue pra descobrir o que pode estar custando dinheiro sem você perceber. 👇
          </p>
          <a href={nextUrl(q, 3)} style={btn(true)}>CONTINUAR →</a>
        </div>
      </div>
    </div>
  );

  // ── Q2 (s=3) — onde compra ───────────────────────────────────
  if (s === 3) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={2} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"20px" }}>
          Onde você costuma (ou pretende) comprar os produtos para revender?
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {[
            ["Lojas físicas ou varejo online","varejo"],
            ["Mercado Livre ou Shopee como compradora","marketplace"],
            ["Já compro de atacadistas mas não sei se são os melhores","atacado_ruim"],
            ["Já tenho fornecedores diretos e bons","atacado_bom"],
          ].map(([label, val]) => (
            <a key={val} href={nextUrl(q, 4, { q2: val })} style={optBtn()}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── DADO (s=4) ───────────────────────────────────────────────
  if (s === 4) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <div style={card}>
          <div style={{ background:"#111", borderRadius:"12px", padding:"20px", marginBottom:"18px", textAlign:"center" }}>
            <p style={{ fontSize:"11px", color:"#9ca3af", fontWeight:700, marginBottom:"10px", letterSpacing:"0.1em" }}>VAREJO VS ATACADO</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              <div style={{ background:"#1a1a1a", borderRadius:"10px", padding:"14px", border:"1px solid #333" }}>
                <div style={{ fontSize:"10px", color:"#ef4444", fontWeight:700, marginBottom:"6px" }}>❌ VAREJO</div>
                <div style={{ fontSize:"24px", fontWeight:900, color:"#fff" }}>R$49,90</div>
                <div style={{ fontSize:"11px", color:"#777", marginTop:"4px" }}>você paga</div>
              </div>
              <div style={{ background:"#1a1a1a", borderRadius:"10px", padding:"14px", border:"1px solid #22c55e" }}>
                <div style={{ fontSize:"10px", color:"#22c55e", fontWeight:700, marginBottom:"6px" }}>✅ ATACADO</div>
                <div style={{ fontSize:"24px", fontWeight:900, color:"#22c55e" }}>R$14,00</div>
                <div style={{ fontSize:"11px", color:"#777", marginTop:"4px" }}>com a lista</div>
              </div>
            </div>
            <div style={{ marginTop:"12px", fontSize:"13px", color:"#f59e0b", fontWeight:800 }}>→ Margem de 256% na mesma camiseta</div>
          </div>
          <p style={{ fontSize:"13px", color:"#555", lineHeight:1.6, marginBottom:"20px" }}>
            O segredo não é vender mais. É <strong>comprar certo desde o início.</strong>
          </p>
          <a href={nextUrl(q, 5)} style={btn(true)}>ENTENDI, CONTINUAR →</a>
        </div>
      </div>
    </div>
  );

  // ── DEPOIMENTOS (s=5) ────────────────────────────────────────
  if (s === 5) return (
    <div style={wrap}>
      <Header />
      {/* carrossel CSS puro — sem JS */}
      <style>{`
        @keyframes dep-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .dep-track { display:flex; width:max-content; animation:dep-scroll 22s linear infinite; }
      `}</style>
      <div style={{ padding:"28px 0 0" }}>
        {/* copy */}
        <div style={{ padding:"0 18px", marginBottom:"20px", textAlign:"center" }}>
          <div style={{ display:"inline-block", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:"100px", padding:"5px 14px", fontSize:"12px", fontWeight:700, color:"#ea580c", marginBottom:"12px" }}>
            ✅ +5.000 revendedoras já acessam
          </div>
          <h2 style={{ fontSize:"20px", fontWeight:900, lineHeight:1.25, marginBottom:"8px" }}>
            Olha o que estão falando 👇
          </h2>
          <p style={{ fontSize:"13px", color:"#6b7280", lineHeight:1.5 }}>
            Gente que também não sabia onde comprar — e encontrou a lista.
          </p>
        </div>

        {/* carrossel */}
        <div style={{ overflow:"hidden", width:"100%", marginBottom:"24px" }}>
          <div className="dep-track">
            {[...Array(2)].flatMap((_, ri) =>
              ["/depoimentos/dep4.webp","/depoimentos/dep5.webp","/depoimentos/dep6.webp",
               "/depoimentos/dep7.webp","/depoimentos/dep8.webp","/depoimentos/dep9.webp"].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <div key={`${ri}-${i}`} style={{ flexShrink:0, width:"220px", marginRight:"12px", borderRadius:"14px", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.14)", border:"1px solid #e5e7eb" }}>
                  <img src={src} alt={`Depoimento ${i+1}`} width={220} height={283} loading="eager" decoding="async" style={{ width:"100%", height:"auto", display:"block" }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA continuar */}
        <div style={{ padding:"0 18px 32px" }}>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"14px", padding:"18px", marginBottom:"14px", textAlign:"center" }}>
            <p style={{ fontSize:"14px", fontWeight:700, color:"#111", marginBottom:"4px" }}>
              Elas compraram. Você pode ser a próxima.
            </p>
            <p style={{ fontSize:"12px", color:"#6b7280" }}>
              Faltam só mais 3 perguntas pro seu resultado personalizado.
            </p>
          </div>
          <a href={nextUrl(q, 6)} style={btn(true)}>QUERO VER MEU RESULTADO →</a>
        </div>
      </div>
    </div>
  );

  // ── Q3 (s=6) — situação ──────────────────────────────────────
  if (s === 6) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={3} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"20px" }}>
          Qual dessas situações mais se parece com a sua realidade hoje?
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {[
            ["Quero vender mas não sei onde achar fornecedor confiável","sem_fornecedor"],
            ["Tenho medo de cair em golpe ou receber produto ruim","medo_golpe"],
            ["Acho que preciso de muito dinheiro pra começar","muito_capital"],
            ["Já compro mas minha margem não está boa","margem_ruim"],
          ].map(([label, val]) => (
            <a key={val} href={nextUrl(q, 7, { q3: val })} style={optBtn()}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Q4 (s=7) — capital ───────────────────────────────────────
  if (s === 7) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={4} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"20px" }}>
          Com quanto você estaria disposta a começar agora?
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {[
            ["Menos de R$100","ate100"],
            ["De R$100 a R$300","100a300"],
            ["De R$300 a R$500","300a500"],
            ["Mais de R$500","mais500"],
          ].map(([label, val]) => (
            <a key={val} href={nextUrl(q, 8, { q4: val })} style={optBtn()}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Q5 (s=8) — categoria ─────────────────────────────────────
  if (s === 8) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={5} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"8px" }}>
          Qual categoria te interessa mais?
        </h2>
        <p style={{ fontSize:"12px", color:"#9ca3af", marginBottom:"18px" }}>Seu resultado mostrará os fornecedores dessa categoria.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {Object.keys(CATEGORIAS).map(cat => (
            <a key={cat} href={nextUrl(q, 9, { q5: cat })} style={optBtn()}>{cat}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Q6 (s=9) — CNPJ ─────────────────────────────────────────
  if (s === 9) return (
    <div style={wrap}>
      <Header />
      <div style={inner}>
        <Progress n={6} />
        <h2 style={{ fontSize:"19px", fontWeight:900, lineHeight:1.3, marginBottom:"20px" }}>
          Você tem CNPJ ou prefere comprar como pessoa física?
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {[
            ["Só tenho CPF mesmo","cpf"],
            ["Tenho CNPJ","cnpj"],
            ["Não sei se preciso de CNPJ","nao_sei"],
          ].map(([label, val]) => (
            <a key={val} href={nextUrl(q, 10, { q6: val })} style={optBtn()}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );

  // ── LOADING (s=10) — CSS puro + meta refresh ──────────────────
  if (s === 10) {
    const resultUrl = nextUrl(q, 11);
    return (
      <div style={wrap}>
        {/* meta refresh — avança sem JS após 2.5s */}
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <head>
          <meta httpEquiv="refresh" content={`3;url=${resultUrl}`} />
        </head>
        <Header />
        <div style={inner}>
          <div style={{ ...card, textAlign:"center" }}>
            <div style={{ fontSize:"36px", marginBottom:"18px" }}>⚙️</div>
            <h2 style={{ fontSize:"18px", fontWeight:900, marginBottom:"20px" }}>Analisando seu perfil...</h2>
            <style>{`
              @keyframes load { 0%{width:0%} 100%{width:100%} }
              .bar { width:0%; background:#ea580c; height:8px; border-radius:100px; animation:load 2.8s ease forwards; }
            `}</style>
            <div style={{ background:"#f3f4f6", borderRadius:"100px", height:"8px", marginBottom:"20px", overflow:"hidden" }}>
              <div className="bar" />
            </div>
            <p style={{ fontSize:"13px", color:"#555" }}>Verificando fornecedores disponíveis para você...</p>
            <p style={{ marginTop:"16px" }}>
              <a href={resultUrl} style={{ fontSize:"12px", color:"#9ca3af", textDecoration:"underline" }}>
                Não redirecionou? Clique aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTADO (s=11) ─────────────────────────────────────────
  const cat = params.q5 ? CATEGORIAS[params.q5] : null;
  const temCPF = params.q6 === "cpf" || params.q6 === "nao_sei";
  const poucoCapital = params.q4 === "ate100";

  return (
    <div style={wrap}>
      {/* dispara ViewContent assim que a página de resultado monta */}
      <QuizViewContent />
      <Header />
      <div style={inner}>

        {/* resultado personalizado */}
        <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:"16px", padding:"20px", marginBottom:"16px", textAlign:"center" }}>
          <div style={{ fontSize:"12px", fontWeight:700, color:"#ea580c", marginBottom:"8px" }}>🎯 SEU RESULTADO</div>
          <h2 style={{ fontSize:"20px", fontWeight:900, lineHeight:1.3, marginBottom:"10px" }}>
            {cat
              ? `${cat.fornecedores} fornecedores de ${params.q5} na lista`
              : "Mais de 180 fornecedores verificados para o seu perfil"}
          </h2>
          {cat && (
            <p style={{ fontSize:"13px", color:"#555", lineHeight:1.5 }}>
              Margem média de <strong style={{ color:"#ea580c" }}>{cat.margem}</strong>.<br />
              <em style={{ fontSize:"12px", color:"#9ca3af" }}>{cat.exemplo}</em>
            </p>
          )}
        </div>

        {/* o que você recebe */}
        <div style={{ ...card, marginBottom:"16px" }}>
          <div style={{ fontSize:"13px", fontWeight:800, marginBottom:"14px" }}>O que você vai acessar:</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[
              `${cat ? cat.fornecedores : "180"}+ fornecedores com contato direto (WhatsApp + site)`,
              temCPF ? "A maioria aceita CPF — sem precisar de CNPJ" : "Fornecedores que emitem nota fiscal para CNPJ",
              poucoCapital ? "Vários com pedido mínimo abaixo de R$100" : "Fornecedores para todos os tamanhos de pedido",
              "Avaliação de confiabilidade — só fornecedores testados",
              "6 bônus exclusivos inclusos sem custo extra",
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"13px", color:"#333" }}>
                <span style={{ color:"#22c55e", flexShrink:0, fontWeight:700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* prova social */}
        <div style={{ background:"#f9fafb", borderRadius:"12px", padding:"14px", marginBottom:"16px" }}>
          <div style={{ fontSize:"13px", color:"#f59e0b", marginBottom:"6px" }}>★★★★★</div>
          <p style={{ fontSize:"13px", color:"#555", lineHeight:1.6, fontStyle:"italic", margin:0 }}>
            "Comprei, abri e em 20 minutos já tinha o WhatsApp de 3 fornecedores que nunca achei no Google. Primeiro pedido no mesmo dia."
          </p>
        </div>

        {/* oferta */}
        <div style={{ background:"#fff", border:"2px solid #ea580c", borderRadius:"16px", padding:"20px", marginBottom:"16px", textAlign:"center" }}>
          <div style={{ display:"inline-block", background:"#ea580c", color:"#fff", fontSize:"11px", fontWeight:800, padding:"4px 14px", borderRadius:"100px", marginBottom:"12px" }}>ACESSO COMPLETO</div>
          <div style={{ fontSize:"13px", color:"#9ca3af", textDecoration:"line-through", marginBottom:"4px" }}>De R$397,00 por apenas:</div>
          <div style={{ fontSize:"46px", fontWeight:900, color:"#ea580c", lineHeight:1, marginBottom:"6px" }}>R$37,90</div>
          <div style={{ fontSize:"12px", color:"#22c55e", fontWeight:700, marginBottom:"18px" }}>PAGAMENTO ÚNICO • ACESSO VITALÍCIO</div>
          <CheckoutBtn label="QUERO ACESSAR AGORA →" />
          <p style={{ fontSize:"11px", color:"#9ca3af", margin:0 }}>🔒 Pix ou cartão • Acesso na hora no e-mail • 7 dias de garantia</p>
        </div>

        {/* por que barato */}
        <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:"12px", padding:"14px" }}>
          <div style={{ fontSize:"13px", fontWeight:800, color:"#111", marginBottom:"4px" }}>🤔 Por que tão barato?</div>
          <div style={{ fontSize:"12px", color:"#555", lineHeight:1.6 }}>
            É promoção de lançamento. Preferimos cobrar pouco e ter milhares de clientes satisfeitas do que cobrar caro de poucas. Você ainda tem <strong>7 dias de garantia</strong> — se não gostar, devolvemos 100%. Risco zero.
          </div>
        </div>
      </div>

      <CheckoutBtn label="ACESSAR FORNECEDORES — R$37,90" bar />
    </div>
  );
}

function Header() {
  return (
    <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 20px", textAlign:"center" }}>
      <span style={{ fontSize:"18px", fontWeight:900, color:"#ea580c" }}>
        Fornecedor<span style={{ color:"#111" }}>Vip</span>
      </span>
    </div>
  );
}

