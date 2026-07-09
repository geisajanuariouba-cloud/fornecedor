"use client";

import { useState, useEffect } from "react";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "https://pay.wiapy.com/gTiNVrOtMoj";
const PRICE_VALUE = 67.9;

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

const TRACK_KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","src","sck","fbclid","gclid"];
const UTM_STORE = "fv_utms";

function persistUTMs() {
  try {
    const sp = new URLSearchParams(window.location.search);
    const stored: Record<string,string> = {};
    let found = false;
    TRACK_KEYS.forEach(k => { const v = sp.get(k); if (v) { stored[k] = v; found = true; } });
    if (found) localStorage.setItem(UTM_STORE, JSON.stringify(stored));
  } catch { /**/ }
}

function buildCheckoutUrl() {
  let params: Record<string,string> = {};
  try { params = JSON.parse(localStorage.getItem(UTM_STORE) ?? "{}"); } catch { /**/ }
  try {
    const sp = new URLSearchParams(window.location.search);
    TRACK_KEYS.forEach(k => { const v = sp.get(k); if (v) params[k] = v; });
  } catch { /**/ }
  const qs = new URLSearchParams(params).toString();
  if (!qs) return CHECKOUT_URL;
  return `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}${qs}`;
}

function scrollToCTA(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

let redirecting = false;
function goToCheckout(e?: React.MouseEvent) {
  if (e) e.preventDefault();
  if (redirecting) return;
  redirecting = true;
  const eventId = `ic_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
  const dest = buildCheckoutUrl();
  // Não disparamos fbq aqui — o Utmify já dispara InitiateCheckout ao detectar a navegação para o checkout
  const fbp = document.cookie.split(";").find(c=>c.trim().startsWith("_fbp="))?.split("=")[1] ?? "";
  const fbc = document.cookie.split(";").find(c=>c.trim().startsWith("_fbc="))?.split("=")[1] ?? "";
  fetch("/api/capi",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ fbp, fbc, url: window.location.href, event_id: eventId, value: PRICE_VALUE }), keepalive: true }).catch(()=>{});
  setTimeout(() => { window.location.href = dest; redirecting = false; }, 350);
}

/* ── hooks ── */

function useCountdown(totalSeconds: number) {
  const [time, setTime] = useState(totalSeconds);
  useEffect(() => {
    const key = "fv_oferta_cd2";
    let end = parseInt(localStorage.getItem(key) ?? "0", 10);
    if (!end || end < Date.now()) {
      end = Date.now() + totalSeconds * 1000;
      localStorage.setItem(key, String(end));
    }
    const tick = () => setTime(Math.max(0, Math.round((end - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600).toString().padStart(2,"0");
  const m = Math.floor((time % 3600) / 60).toString().padStart(2,"0");
  const s = (time % 60).toString().padStart(2,"0");
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

/* ── dados ── */

const COUNTDOWN_SECONDS = 15 * 60;

const categorias = [
  { label: "ROUPAS", emoji: "👗" },
  { label: "LINGERIE", emoji: "👙" },
  { label: "ELETRÔNICOS E CELULARES", emoji: "📱" },
  { label: "MAQUIAGEM E COSMÉTICOS", emoji: "💄" },
  { label: "PERFUMES", emoji: "🌸" },
  { label: "BIJUTERIAS E SEMIJOIAS", emoji: "💎" },
  { label: "BRINQUEDOS", emoji: "🧸" },
  { label: "EMBALAGENS", emoji: "📦" },
  { label: "GAMES", emoji: "🎮" },
  { label: "PAPELARIA", emoji: "📚" },
  { label: "ALIMENTOS", emoji: "🍎" },
  { label: "BEBIDAS", emoji: "🥤" },
  { label: "PRODUTOS DE LIMPEZA", emoji: "🧹" },
  { label: "SUPLEMENTOS", emoji: "💊" },
];

const LISTA_VALOR = 397;

const bonuses = [
  { n:"01", emoji:"🔥", title:"LISTA DOS PRODUTOS MAIS VENDIDOS", desc:"Antes de ir atrás do fornecedor, saiba o que vender: os produtos que mais giram hoje no Mercado Livre, Shopee e Amazon — com margem confirmada.", valor: 37 },
  { n:"02", emoji:"📊", title:"CATÁLOGO DE TENDÊNCIAS", desc:"As tendências da próxima temporada para comprar do fornecedor antes de todo mundo e chegar na frente quando a demanda explodir.", valor: 47 },
  { n:"03", emoji:"🏪", title:"GUIA LOJA DE 10", desc:"Monte sua operação de revenda do zero e chegue às primeiras vendas — sem loja física, sem experiência e sem complicar.", valor: 37 },
  { n:"04", emoji:"📸", title:"PACOTE INFLUENCER PARA INSTAGRAM", desc:"Templates prontos para vender no Instagram sem precisar aparecer. Artes, legendas e estratégias para iniciantes conseguirem as primeiras vendas.", valor: 57 },
  { n:"05", emoji:"🤖", title:"COMO GERAR IMAGENS COM IA", desc:"Crie fotos profissionais dos seus produtos com inteligência artificial — sem fotógrafo, sem modelo, sem gastar nada a mais.", valor: 37 },
  { n:"06", emoji:"💬", title:"GRUPOS E COMUNIDADES NO WHATSAPP", desc:"Acesso direto a grupos com fornecedores ativos. Negocie preços, tire dúvidas e receba lançamentos antes de todo mundo.", valor: 67 },
];

const bonusTotal = bonuses.reduce((s, b) => s + b.valor, 0);
const totalGeral = LISTA_VALOR + bonusTotal;

const faqs = [
  { q:"O que é a Lista de Fornecedores?", a:"É um arquivo digital com 180 fornecedores verificados, com contato direto, categorias de produtos, condições de compra e forma de pagamento. Tudo que você precisa para começar a revender hoje mesmo." },
  { q:"Esses fornecedores são diferentes dos que aparecem no Google?", a:"Sim. Essa não é uma lista copiada do Google. Cada fornecedor foi verificado manualmente: testamos o contato, confirmamos que vende para pessoa física e checamos o pedido mínimo real. Se não passou nesse critério, não entrou na lista." },
  { q:"Como sei que os fornecedores são confiáveis?", a:"Todos os fornecedores foram testados por quem usa essa lista na própria operação de revenda. Verificamos site, telefone, WhatsApp e condições de compra antes de incluir qualquer um. Você recebe só o que foi aprovado." },
  { q:"Preciso de CNPJ para comprar dos fornecedores?", a:"Não! A maioria dos fornecedores da lista vende para pessoa física. Você consegue comprar com CPF mesmo, sem burocracia." },
  { q:"Com quanto capital posso começar?", a:"Com menos de R$100! A maioria dos fornecedores aceita pedidos pequenos, perfeitos para quem está começando e quer testar antes de investir mais." },
  { q:"Quanto tempo leva pra começar a vender após acessar a lista?", a:"O acesso chega no seu e-mail em menos de 1 minuto após o pagamento. Muitos clientes já entram em contato com o primeiro fornecedor no mesmo dia e fazem o primeiro pedido dentro de 48 horas." },
  { q:"Quais categorias têm na lista?", a:"Roupas, Lingerie, Eletrônicos e Celulares, Maquiagem e Cosméticos, Perfumes, Bijuterias e Semijoias, Brinquedos, Embalagens, Games, Papelaria, Alimentos, Bebidas, Produtos de Limpeza e Suplementos. 180 fornecedores em 14 categorias." },
  { q:"Como recebo o acesso após a compra?", a:"Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail. O acesso é vitalício, compre agora e abra quando quiser, sem prazo." },
  { q:"Tem garantia?", a:"Sim. Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas e sem burocracia. O risco é inteiramente nosso." },
  { q:"O preço vai aumentar?", a:"Sim. Esse valor de R$67,90 é promocional e encerra quando o contador zerar. Após isso, o preço sobe. Garantir agora é a única forma de pagar o menor valor." },
  { q:"Posso vender nos marketplaces (Mercado Livre, Shopee, Amazon)?", a:"Com certeza! Os fornecedores da lista foram selecionados pensando nos marketplaces. Você consegue margem suficiente para cobrir taxas e ainda lucrar bem." },
  { q:"Já comprei uma lista de fornecedores antes e não funcionou. Por que essa é diferente?", a:"Porque a maioria das listas que circulam por aí foi copiada do Google ou montada sem qualquer verificação real. Nós verificamos mais de 500 fornecedores, ligamos, mandamos mensagem e checamos as condições — e aprovamos apenas 180. Fornecedor que não responde não entra. Quem exige CNPJ não entra. Pedido mínimo alto não entra. É exatamente isso que faz a diferença quando outra lista falhou." },
];

/* ── componentes ── */

function IconCheck({ size=20, color="#22c55e" }: { size?:number; color?:string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function IconX({ size=16 }: { size?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}

function UrgencyCountdown() {
  const { h, m, s } = useCountdown(COUNTDOWN_SECONDS);
  return (
    <span style={{ background:"rgba(0,0,0,0.25)", borderRadius:"6px", padding:"2px 10px", marginLeft:"6px", fontVariantNumeric:"tabular-nums", letterSpacing:"1px" }}>
      {h}:{m}:{s}
    </span>
  );
}

function CountdownBox() {
  const { h, m, s } = useCountdown(COUNTDOWN_SECONDS);
  const box: React.CSSProperties = { background:"#1a1a1a", border:"1px solid #333", borderRadius:"8px", padding:"10px 14px", textAlign:"center", minWidth:"58px" };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"6px", justifyContent:"center" }}>
      {[{v:h,l:"Horas"},{v:m,l:"Minutos"},{v:s,l:"Segundos"}].map((item,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <div style={box}>
            <div style={{ fontSize:"28px", fontWeight:900, color:"#ea580c", fontVariantNumeric:"tabular-nums" }}>{item.v}</div>
            <div style={{ fontSize:"9px", color:"#9ca3af", fontWeight:600 }}>{item.l}</div>
          </div>
          {i < 2 && <span style={{ fontSize:"22px", fontWeight:900, color:"#ea580c" }}>:</span>}
        </div>
      ))}
    </div>
  );
}

function ExitIntentPopup({ isMobile }: { isMobile:boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isMobile) return;
    const shown = sessionStorage.getItem("fv_exit_shown_oferta");
    if (shown) return;
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        setVisible(true);
        sessionStorage.setItem("fv_exit_shown_oferta","1");
        document.removeEventListener("mouseleave", onMouseOut);
      }
    };
    document.addEventListener("mouseleave", onMouseOut);
    return () => document.removeEventListener("mouseleave", onMouseOut);
  }, [isMobile]);
  if (!visible) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={() => setVisible(false)}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 32px", maxWidth:"440px", width:"100%", textAlign:"center", position:"relative", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }} onClick={e=>e.stopPropagation()}>
        <button onClick={() => setVisible(false)} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#9ca3af", fontFamily:"inherit" }}>✕</button>
        <div style={{ fontSize:"44px", marginBottom:"12px" }}>⏳</div>
        <h3 style={{ fontSize:"20px", fontWeight:900, color:"#111", marginBottom:"8px", lineHeight:1.3 }}>Espera — você vai deixar os 6 bônus pra trás?</h3>
        <p style={{ fontSize:"14px", color:"#555", lineHeight:1.6, marginBottom:"20px" }}>
          Você ainda não garantiu acesso aos <strong>180 fornecedores</strong> e aos <strong>6 bônus exclusivos</strong>. Por <strong style={{color:"#ea580c"}}>R$67,90</strong> à vista ou <strong style={{color:"#ea580c"}}>12x de R$5,66</strong> no cartão.
        </p>
        <a href="#cta-principal" onClick={(e) => { scrollToCTA(e); setVisible(false); }} style={{ display:"block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"16px", fontSize:"16px", fontWeight:800, textTransform:"uppercase", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(234,88,12,0.35)", marginBottom:"10px" }}>
          QUERO GARANTIR MEU ACESSO
        </a>
        <button onClick={() => setVisible(false)} style={{ background:"none", border:"none", fontSize:"12px", color:"#9ca3af", cursor:"pointer", fontFamily:"inherit" }}>
          Não, prefiro continuar pagando caro em fornecedor
        </button>
      </div>
    </div>
  );
}

/* ── Página ── */

export default function FornecedoresOfertaPage() {
  const isMobile = useIsMobile();

  useEffect(() => { persistUTMs(); }, []);

  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      if (window.fbq) { window.fbq("track","ViewContent",PRODUCT_DATA); clearInterval(id); }
      else if (++tries > 40) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const maxW = 860;
  const secPad = isMobile ? "40px 20px" : "60px 40px";

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:"#fff", minHeight:"100vh", color:"#111" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        #cta-principal { scroll-margin-top: 80px; }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .cat-track { display:flex; gap:12px; width:max-content; animation:marquee 32s linear infinite; }
        .cat-track:hover { animation-play-state:paused; }
        @keyframes marquee2 { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .dep-track { display:flex; gap:16px; width:max-content; animation:marquee2 28s linear infinite; }
        .dep-track:hover { animation-play-state:paused; }
        details.faq { border:1.5px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
        details.faq[open] { border-color:#ea580c; }
        details.faq summary { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; font-weight:700; font-size:15px; color:#111; gap:12px; cursor:pointer; list-style:none; font-family:inherit; }
        details.faq[open] summary { background:#fff7ed; color:#ea580c; }
        details.faq summary::-webkit-details-marker { display:none; }
        details.faq summary::after { content:'▼'; font-size:11px; color:#555; flex-shrink:0; transition:transform 0.2s; }
        details.faq[open] summary::after { transform:rotate(180deg); }
        details.faq .faq-body { padding:0 24px 20px; font-size:15px; color:#555; line-height:1.7; }
        @media (max-width:767px) {
          details.faq summary { padding:16px; font-size:13px; }
          details.faq .faq-body { padding:0 16px 16px; font-size:13px; }
        }
      ` }} />

      {/* ── URGENCY BAR ── */}
      <div style={{ background:"#ea580c", color:"#fff", textAlign:"center", padding:"10px 16px", fontSize:"13px", fontWeight:700 }}>
        🔥 OFERTA ESPECIAL ENCERRA EM: <UrgencyCountdown />
      </div>

      {/* ── HERO ── */}
      <div style={{ background:"#fff7ed", padding: isMobile ? "32px 20px 28px" : "48px 40px 40px" }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center" }}>
          <div style={{ marginBottom:"24px" }}>
            <span style={{ fontSize:"22px", fontWeight:900, color:"#ea580c" }}>Fornecedor<span style={{color:"#111"}}>Vip</span></span>
          </div>
          <div style={{ display:"inline-block", background:"#111", color:"#ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:800, letterSpacing:"0.08em", marginBottom:"16px" }}>
            CHEGA DE PERDER MARGEM COMPRANDO NO LUGAR ERRADO
          </div>

          <h1 style={{ fontSize:isMobile?"26px":"42px", fontWeight:900, lineHeight:1.2, marginBottom:"16px", color:"#111" }}>
            Como comprar{" "}
            <span style={{ color:"#ea580c" }}>direto no atacado</span>{" "}
            e lucrar{" "}
            <span style={{ color:"#ea580c" }}>100% ou mais</span>
            {" "}mesmo que você já tenha tentado e encontrado lista ruim, fornecedor que não responde ou pedido mínimo absurdo
          </h1>
          <p style={{ fontSize:isMobile?"15px":"18px", color:"#555", lineHeight:1.6, marginBottom:"20px", maxWidth:"640px", margin:"0 auto 20px" }}>
            Sem CNPJ, sem experiência e com menos de R$100 no bolso. 180 fornecedores verificados — contato ativo e pedido mínimo confirmado.
          </p>

          <button
            id="vsl-play-btn"
            onClick={() => {
              const video = document.getElementById("vsl-video") as HTMLVideoElement;
              const btn = document.getElementById("vsl-play-btn");
              if (!video) return;
              video.muted = false;
              video.play().catch(() => {});
              if (btn) btn.style.display = "none";
            }}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"12px", background:"#ea580c", color:"#fff", border:"none", borderRadius:"12px", padding:isMobile?"16px 28px":"18px 48px", fontSize:isMobile?"16px":"18px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.5px", boxShadow:"0 4px 24px rgba(234,88,12,0.5)", fontFamily:"inherit", cursor:"pointer", margin:"0 auto 20px", animation:"pulse-cta 1.8s ease-in-out infinite" }}
          >
            <span style={{ fontSize:"22px" }}>▶</span> Clique aqui e comece a assistir
          </button>
          <style>{`@keyframes pulse-cta { 0%,100%{box-shadow:0 4px 24px rgba(234,88,12,0.5)} 50%{box-shadow:0 4px 40px rgba(234,88,12,0.85)} }`}</style>

          {/* Video player */}
          <div style={{ borderRadius:"16px", overflow:"hidden", maxWidth:"640px", margin:"0 auto 12px", boxShadow:"0 8px 40px rgba(0,0,0,0.3)", background:"#000" }}>
            <video
              id="vsl-video"
              controls
              playsInline
              preload="none"
              style={{ width:"100%", display:"block" }}
              poster="/vsl/cover.jpg"
            >
              <source src="/vsl/vsl.mp4" type="video/mp4" />
            </video>
          </div>

          <div style={{ maxWidth:"640px", margin:"0 auto 28px" }} />

          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:isMobile?"16px 28px":"18px 48px", fontSize:isMobile?"16px":"18px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.5px", boxShadow:"0 4px 24px rgba(234,88,12,0.4)", fontFamily:"inherit" }}>
            QUERO ACESSO AGORA →
          </a>
          <p style={{ fontSize:"12px", color:"#9ca3af", marginTop:"10px" }}>🔒 Acesso imediato • Pagamento único • 7 dias de garantia</p>

          <div style={{ display:"flex", justifyContent:"center", gap:isMobile?"16px":"40px", marginTop:"32px", flexWrap:"wrap" }}>
            {[{ v:"180+", l:"Fornecedores" },{ v:"500+", l:"Verificados" },{ v:"7 dias", l:"Garantia" }].map(s => (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:isMobile?"22px":"28px", fontWeight:900, color:"#ea580c" }}>{s.v}</div>
                <div style={{ fontSize:"12px", color:"#6b7280", fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIAS ── */}
      <div style={{ background:"#fff", padding:secPad, borderTop:"1px solid #f3f4f6" }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center", marginBottom:"28px" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>O QUE VOCÊ ACESSA</div>
          <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, textTransform:"uppercase", marginBottom:"6px" }}>14 CATEGORIAS QUE VOCÊ PODE ACESSAR AINDA HOJE</h2>
          <p style={{ fontSize:"13px", color:"#6b7280" }}>Mais de 180 fornecedores verificados em 14 categorias, de Roupas a Suplementos</p>
        </div>
        <div style={{ overflow:"hidden", marginBottom:"28px" }}>
          <div className="cat-track">
            {[...Array(2)].flatMap((_, setIdx) =>
              categorias.map(cat => (
                <div key={`${setIdx}-${cat.label}`} style={{ flexShrink:0, border:"2.5px solid #e879a0", borderRadius:"14px", overflow:"hidden", background:"#fff", width:isMobile?"100px":"130px" }}>
                  <div style={{ width:"100%", height:isMobile?"80px":"100px", background:"#fff7ed", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:isMobile?"36px":"46px", lineHeight:1 }}>{cat.emoji}</span>
                  </div>
                  <div style={{ padding:"6px 4px 8px", textAlign:"center" }}>
                    <span style={{ fontSize:"9px", fontWeight:800, color:"#111", letterSpacing:"0.02em", lineHeight:1.3 }}>{cat.label}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"16px 32px", fontSize:"15px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(234,88,12,0.35)", fontFamily:"inherit" }}>
            QUERO ACESSAR ESSAS CATEGORIAS
          </a>
        </div>
      </div>

      {/* ── COMPARAÇÃO ── */}
      <div style={{ background:"#f9fafb", padding:secPad }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>POR QUE A LISTA VIP?</div>
          <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, marginBottom:"12px", textTransform:"uppercase" }}>A DIFERENÇA É <span style={{color:"#ea580c"}}>GRITANTE</span></h2>
          <p style={{ fontSize:isMobile?"13px":"15px", color:"#555", lineHeight:1.7, maxWidth:"640px", margin:"0 auto 28px" }}>
            Você pesquisa no Google. Manda mensagem. Silêncio. Acha uma lista barata. Metade dos contatos está morta. O outro exige CNPJ ou pedido mínimo de R$2.000. Você desiste e compra no varejo de novo — com margem de 20% quando tem sorte. É exatamente isso que a Lista VIP resolve.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:isMobile?"14px":"32px", maxWidth:"860px", margin:"0 auto 36px" }}>
            <div style={{ border:"2px solid #fecaca", borderRadius:"16px", overflow:"hidden" }}>
              <div style={{ background:"#fee2e2", padding:isMobile?"14px":"18px 24px", fontWeight:800, fontSize:isMobile?"13px":"16px", color:"#dc2626" }}>❌ SEM A LISTA</div>
              <div style={{ padding:isMobile?"14px":"20px 24px", display:"flex", flexDirection:"column", gap:isMobile?"12px":"16px" }}>
                {["Compra no varejo e perde metade da margem","Pesquisa no Google e o fornecedor não responde","Compra lista genérica com metade dos contatos mortos","Acha que precisa de CNPJ ou muito capital","Perde tempo testando fornecedor ruim um por um"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:"8px", textAlign:"left" }}>
                    <IconX size={isMobile?16:20}/><span style={{ fontSize:isMobile?"13px":"15px", color:"#555", lineHeight:1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border:"2px solid #86efac", borderRadius:"16px", overflow:"hidden" }}>
              <div style={{ background:"#dcfce7", padding:isMobile?"14px":"18px 24px", fontWeight:800, fontSize:isMobile?"13px":"16px", color:"#16a34a" }}>✅ COM A LISTA VIP</div>
              <div style={{ padding:isMobile?"14px":"20px 24px", display:"flex", flexDirection:"column", gap:isMobile?"12px":"16px" }}>
                {["Compra no atacado com 100%+ de margem","180 fornecedores verificados no bolso","Todos testados e aprovados","Começa com menos de R$100","Começa hoje mesmo, sem enrolação"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:"8px", textAlign:"left" }}>
                    <IconCheck size={isMobile?16:20}/><span style={{ fontSize:isMobile?"13px":"15px", color:"#555", lineHeight:1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"16px 32px", fontSize:"15px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(234,88,12,0.35)", fontFamily:"inherit" }}>
            QUERO ACESSAR A LISTA AGORA
          </a>
        </div>
      </div>

      {/* ── MECANISMO ÚNICO ── */}
      <div style={{ background:"#111", padding:secPad }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>POR QUE ESSA LISTA É DIFERENTE?</div>
          <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, color:"#fff", marginBottom:"10px", textTransform:"uppercase" }}>
            Tem gente vendendo "lista de fornecedores" no Telegram por R$9,90.<br/>
            <span style={{ color:"#ea580c" }}>Com 800 contatos que ninguém responde há 2 anos.</span>
          </h2>
          <p style={{ fontSize:isMobile?"13px":"15px", color:"#9ca3af", marginBottom:"32px", maxWidth:"560px", margin:"0 auto 32px" }}>
            Essa não é essa. Verificamos mais de 500 fornecedores. 180 passaram. Cada um passou por 3 filtros antes de entrar:
          </p>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr", gap:"16px", marginBottom:"32px" }}>
            {[
              { n:"01", title:"Testamos o contato", desc:"Ligamos e mandamos mensagem. Se não respondeu dentro do prazo, não entrou na lista. Você não vai encontrar número morto aqui." },
              { n:"02", title:"Confirmamos que vende pra PF", desc:"Sem CNPJ, sem burocracia. Verificamos que você consegue comprar com CPF mesmo — igual a qualquer pessoa física." },
              { n:"03", title:"Checamos o pedido mínimo real", desc:"Nada de 'mínimo R$5.000' escondido. Só entrou quem aceita pedido pequeno, ideal pra quem está começando." },
            ].map(item => (
              <div key={item.n} style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:"16px", padding:"24px 20px", textAlign:"left" }}>
                <div style={{ fontSize:"11px", fontWeight:800, color:"#ea580c", marginBottom:"8px" }}>FILTRO {item.n}</div>
                <div style={{ fontSize:isMobile?"15px":"17px", fontWeight:900, color:"#fff", marginBottom:"10px", lineHeight:1.3 }}>✅ {item.title}</div>
                <div style={{ fontSize:"13px", color:"#9ca3af", lineHeight:1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:"12px", color:"#555", marginTop:"24px", marginBottom:"8px" }}>
            Lista atualizada em <strong style={{color:"#ea580c"}}>Julho/2026</strong> · revisada a cada 3 meses
          </p>
          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"16px 32px", fontSize:"15px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(234,88,12,0.35)", fontFamily:"inherit" }}>
            QUERO ACESSO À LISTA VERIFICADA
          </a>
        </div>
      </div>

      {/* ── O QUE VEM DE CADA FORNECEDOR ── */}
      <div style={{ background:"#fff", padding:secPad, borderTop:"1px solid #f3f4f6" }}>
        <div style={{ maxWidth:maxW, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>O QUE VOCÊ RECEBE</div>
            <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, marginBottom:"8px", textTransform:"uppercase" }}>Cada fornecedor vem com <span style={{color:"#ea580c"}}>tudo pronto</span></h2>
            <p style={{ fontSize:isMobile?"13px":"15px", color:"#555", maxWidth:"540px", margin:"0 auto" }}>
              Você não recebe só um nome. Para cada um dos 180 fornecedores, a lista entrega:
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:"12px", marginBottom:"28px" }}>
            {[
              { emoji:"📞", label:"Contato direto", desc:"WhatsApp ou telefone para falar na hora" },
              { emoji:"🌐", label:"Site oficial", desc:"Endereço do site para acessar o catálogo" },
              { emoji:"✉️", label:"E-mail", desc:"Para fazer pedidos e tirar dúvidas" },
              { emoji:"📍", label:"Localização", desc:"Estado e cidade do fornecedor" },
              { emoji:"📦", label:"Pedido mínimo real", desc:"Quanto você precisa ter pra começar" },
              { emoji:"💳", label:"Formas de pagamento", desc:"Pix, boleto, cartão — o que aceita" },
              { emoji:"🪪", label:"Vende pra CPF", desc:"Confirmado que não exige CNPJ" },
              { emoji:"🏷️", label:"Categoria do produto", desc:"O segmento exato que esse fornecedor atende" },
            ].map(item => (
              <div key={item.label} style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:"14px", padding:"16px 14px", textAlign:"center" }}>
                <div style={{ fontSize:"28px", marginBottom:"8px" }}>{item.emoji}</div>
                <div style={{ fontSize:isMobile?"12px":"13px", fontWeight:800, color:"#111", marginBottom:"4px", lineHeight:1.3 }}>{item.label}</div>
                <div style={{ fontSize:"11px", color:"#6b7280", lineHeight:1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"#111", borderRadius:"14px", padding:isMobile?"16px":"20px 28px", display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
            <div style={{ fontSize:"36px", flexShrink:0 }}>📋</div>
            <div style={{ flex:1, minWidth:"200px" }}>
              <div style={{ fontSize:isMobile?"14px":"16px", fontWeight:800, color:"#fff", marginBottom:"4px" }}>Tudo em um único arquivo, organizado por categoria</div>
              <div style={{ fontSize:isMobile?"12px":"13px", color:"#9ca3af", lineHeight:1.5 }}>Você abre, escolhe a categoria, vê o fornecedor, já tem o contato e entra em conversa na hora. Sem pesquisar, sem filtrar, sem perder tempo.</div>
            </div>
            <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"10px", padding:"14px 24px", fontSize:"14px", fontWeight:800, textTransform:"uppercase", fontFamily:"inherit", flexShrink:0 }}>
              QUERO A LISTA →
            </a>
          </div>
        </div>
      </div>

      {/* ── BÔNUS ── */}
      <div style={{ background:"linear-gradient(160deg,#fff7ed 0%,#fff 100%)", padding:secPad }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>POR TEMPO LIMITADO</div>
          <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, marginBottom:"6px", textTransform:"uppercase" }}>COMPRANDO HOJE VOCÊ LEVA</h2>
          <h3 style={{ fontSize:isMobile?"22px":"32px", fontWeight:900, color:"#ea580c", marginBottom:"32px" }}>+6 PRESENTES DE BRINDE 🎁</h3>

          <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", background:"#fff7ed", border:"2px solid #ea580c", borderRadius:"16px", padding:isMobile?"14px":"20px 24px", textAlign:"left", marginBottom:"12px" }}>
            <div style={{ width:isMobile?"48px":"56px", height:isMobile?"48px":"56px", background:"#ea580c", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:isMobile?"28px":"32px" }}>📋</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"11px", fontWeight:800, color:"#ea580c", marginBottom:"2px" }}>PRODUTO PRINCIPAL</div>
              <div style={{ fontSize:isMobile?"14px":"16px", fontWeight:900, color:"#111", marginBottom:"4px", lineHeight:1.3 }}>LISTA VIP DE FORNECEDORES</div>
              <div style={{ fontSize:"12px", color:"#555", lineHeight:1.5 }}>180 fornecedores verificados em 14 categorias, com contato direto, atacado real e margem de 100% a 400%.</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:"13px", fontWeight:900, color:"#ea580c" }}>R${LISTA_VALOR}</div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px" }}>
            {bonuses.map(b => (
              <div key={b.n} style={{ display:"flex", alignItems:"flex-start", gap:"16px", background:"#fff", border:"1px solid #e5e7eb", borderRadius:"14px", padding:isMobile?"12px":"16px 20px", textAlign:"left" }}>
                <div style={{ width:isMobile?"40px":"48px", height:isMobile?"40px":"48px", background:"#fff7ed", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:isMobile?"24px":"28px" }}>{b.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"10px", fontWeight:800, color:"#ea580c", marginBottom:"1px" }}>BÔNUS {b.n}</div>
                  <div style={{ fontSize:isMobile?"13px":"15px", fontWeight:800, color:"#111", lineHeight:1.3 }}>{b.title}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"10px", color:"#9ca3af", textDecoration:"line-through" }}>R${b.valor}</div>
                  <div style={{ fontSize:"12px", fontWeight:900, color:"#16a34a" }}>GRÁTIS</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:"#111", borderRadius:"14px", padding:"18px 24px", marginBottom:"24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"10px" }}>
              <span style={{ fontSize:isMobile?"13px":"15px", fontWeight:700, color:"#9ca3af" }}>VALOR TOTAL (lista + 6 bônus):</span>
              <span style={{ fontSize:isMobile?"20px":"24px", fontWeight:900, color:"#fff", textDecoration:"line-through" }}>R$ {totalGeral},00</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", borderTop:"1px solid #333", paddingTop:"10px" }}>
              <div>
                <span style={{ fontSize:isMobile?"13px":"15px", fontWeight:800, color:"#ea580c" }}>VOCÊ PAGA HOJE:</span>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"6px", background:"#22c55e", borderRadius:"6px", padding:"4px 10px" }}>
                  <span style={{ fontSize:"13px", fontWeight:900, color:"#fff" }}>-90% de desconto</span>
                </div>
              </div>
              <div style={{ fontSize:isMobile?"32px":"38px", fontWeight:900, color:"#ea580c", lineHeight:1 }}>R$ 67,90</div>
              <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"4px" }}>ou 12x de <strong style={{color:"#fff"}}>R$5,66</strong> no cartão</div>
            </div>
          </div>

          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"18px 48px", fontSize:isMobile?"16px":"18px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 24px rgba(234,88,12,0.4)", fontFamily:"inherit" }}>
            QUERO TUDO ISSO AGORA →
          </a>
        </div>
      </div>

      {/* ── RESULTADOS REAIS ── */}
      <div style={{ background:"#fff", padding:secPad }}>
        <div style={{ maxWidth:maxW, margin:"0 auto", textAlign:"center", marginBottom:"28px" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>QUEM USA</div>
          <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900 }}>RESULTADOS <span style={{color:"#ea580c"}}>REAIS</span></h2>
          <p style={{ fontSize:"14px", color:"#555", marginTop:"8px" }}>Clientes em todo o Brasil já transformaram seus negócios com a lista.</p>
        </div>

        <div style={{ overflow:"hidden", marginBottom:"28px" }}>
          <div className="dep-track">
            {[...Array(2)].flatMap((_, setIdx) =>
              [4,5,6,7,8,9].map(n => (
                <div key={`${setIdx}-${n}`} style={{ flexShrink:0, width:isMobile?"220px":"280px", borderRadius:"16px", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.13)", border:"1px solid #e5e7eb" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/depoimentos/dep${n}.webp`} alt={`Depoimento ${n}`} loading="lazy" decoding="async" style={{ width:"100%", height:"auto", display:"block" }} />
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background:"#fff7ed", border:"2px solid #ea580c", borderRadius:"14px", padding:isMobile?"20px 16px":"24px 32px", margin:"0 auto 28px", maxWidth:"600px", textAlign:"center" }}>
          <div style={{ fontSize:"28px", color:"#ea580c", marginBottom:"10px", lineHeight:1 }}>"</div>
          <p style={{ fontSize:isMobile?"15px":"17px", fontWeight:700, color:"#111", lineHeight:1.5, margin:"0 0 12px" }}>
            "Entrei em contato com 3 fornecedores da lista no mesmo dia que comprei. Em menos de 48h já tinha feito meu primeiro pedido no atacado. Paguei R$340 e revendi por R$1.100 no primeiro mês."
          </p>
          <div style={{ fontSize:"13px", color:"#ea580c", fontWeight:800 }}>Juliana M., Curitiba PR ✅</div>
        </div>

        <div style={{ textAlign:"center" }}>
          <div style={{ color:"#f59e0b", fontSize:"20px", letterSpacing:"2px", marginBottom:"6px" }}>★★★★★</div>
          <p style={{ fontSize:"13px", color:"#555", marginBottom:"20px" }}>Resultados reais de clientes reais</p>
          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:"inline-block", background:"#ea580c", color:"#fff", textDecoration:"none", borderRadius:"12px", padding:"16px 32px", fontSize:"15px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(234,88,12,0.35)", fontFamily:"inherit" }}>
            QUERO ACESSAR OS 180 FORNECEDORES
          </a>
        </div>
      </div>

      {/* ── OFERTA ── */}
      <div id="cta-principal" style={{ background:"linear-gradient(160deg,#0a0a0a 0%,#1a1a1a 100%)", padding:secPad, scrollMarginTop:"0px" }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"20px" }}>ACESSO EXCLUSIVO</div>
          <div style={{ border:"2px solid #333", borderRadius:"20px", padding:isMobile?"24px 20px":"36px 32px", background:"#111" }}>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#9ca3af", textTransform:"uppercase", marginBottom:"8px", letterSpacing:"0.08em" }}>LISTA VIP DE FORNECEDORES</div>
            <div style={{ marginBottom:"16px" }}>
              <div style={{ fontSize:"12px", color:"#6b7280", marginBottom:"4px" }}>
                <span style={{ textDecoration:"line-through" }}>De R${totalGeral},00</span>
                <span style={{ background:"#ea580c", color:"#fff", fontSize:"10px", fontWeight:800, padding:"2px 8px", borderRadius:"100px", marginLeft:"8px" }}>+90% OFF</span>
              </div>
              <div style={{ fontSize:isMobile?"44px":"58px", fontWeight:900, color:"#ea580c", lineHeight:1 }}>R$67,90</div>
              <div style={{ fontSize:"14px", color:"#9ca3af", marginTop:"4px" }}>ou 12x de <strong style={{color:"#fff"}}>R$5,66</strong> no cartão</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"8px", background:"#15803d", borderRadius:"8px", padding:"8px 16px" }}>
                <span style={{ fontSize:isMobile?"16px":"18px", fontWeight:900, color:"#fff" }}>-90% de desconto</span>
              </div>
              <div style={{ fontSize:"12px", color:"#6b7280", fontWeight:600, marginTop:"8px" }}>ACESSO VITALÍCIO • CARTÃO OU PIX</div>
              <div style={{ fontSize:"11px", color:"#555", marginTop:"10px", lineHeight:1.5, padding:"10px", background:"#1a1a1a", borderRadius:"8px", border:"1px solid #2a2a2a" }}>
                Uma hora de consultoria com especialista em fornecedores custa R$250+. Você leva 180 contatos verificados por R$67,90 — porque o produto é digital e nosso objetivo é crescer a base de clientes antes de ajustar o preço.
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"24px", textAlign:"left" }}>
              {["180 fornecedores verificados","14 categorias cobertas","Sem CNPJ necessário","Acesso imediato no e-mail após o pagamento","Suporte via WhatsApp"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <IconCheck size={16} color="#ea580c"/>
                  <span style={{ fontSize:"13px", color:"#ccc" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:"12px", padding:"14px", marginBottom:"20px" }}>
              <p style={{ fontSize:"12px", color:"#9ca3af", marginBottom:"8px", fontWeight:700 }}>⏳ Esta oferta expira em:</p>
              <CountdownBox />
            </div>
            <a href={CHECKOUT_URL} onClick={goToCheckout} style={{ display:"block", boxSizing:"border-box", textAlign:"center", textDecoration:"none", width:"100%", background:"#ea580c", color:"#fff", borderRadius:"12px", padding:"18px", fontSize:"17px", fontWeight:800, textTransform:"uppercase", fontFamily:"inherit", boxShadow:"0 4px 24px rgba(234,88,12,0.4)", marginBottom:"12px" }}>
              QUERO GARANTIR MINHA VAGA →
            </a>
            <p style={{ fontSize:"11px", color:"#6b7280", lineHeight:1.6 }}>
              🔒 Pagamento seguro (Pix ou cartão) • Acesso enviado na hora no e-mail • 7 dias de garantia
            </p>
          </div>
        </div>
      </div>

      {/* ── GARANTIA ── */}
      <div style={{ background:"#fff", padding:secPad }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <div style={{ width:"72px", height:"72px", background:"#ea580c", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <span style={{ fontSize:"32px" }}>🛡️</span>
          </div>
          <h2 style={{ fontSize:isMobile?"22px":"28px", fontWeight:900, marginBottom:"10px", color:"#ea580c" }}>Garantia Incondicional de 7 dias</h2>
          <p style={{ fontSize:isMobile?"14px":"16px", color:"#555", lineHeight:1.6, marginBottom:"12px" }}>
            Compre. Abra a lista. Entre em contato com os fornecedores. Se em 7 dias você achar que não valeu cada centavo dos R$67,90 — manda um e-mail e devolvemos tudo. Sem perguntas. Sem precisar justificar. Sem burocracia nenhuma.
          </p>
          <p style={{ fontSize:isMobile?"14px":"15px", color:"#555", lineHeight:1.6, marginBottom:"16px" }}>
            Eu fico com o risco. Você fica com o resultado. Se a lista não mostrar o caminho pra recuperar o investimento já no primeiro pedido, não mereço o seu dinheiro — simples assim.
          </p>
          <p style={{ fontSize:"12px", color:"#6b7280", lineHeight:1.6, marginBottom:"16px" }}>
            Para reembolso: manda e-mail para <strong style={{color:"#ea580c"}}>contato@fornecedorvip.shop</strong> com assunto "Reembolso". O valor retorna em até 5 dias úteis, sem questionamento. O CDC (Código de Defesa do Consumidor) já garante esse direito em qualquer compra digital — nós só tornamos o processo mais simples.
          </p>
          <p style={{ fontSize:"13px", fontWeight:700, color:"#ea580c", letterSpacing:"0.05em", marginBottom:"24px" }}>VOCÊ É O INTELIGENTE AQUI. TODO O RISCO É MEU.</p>
          <a href="#cta-principal" onClick={scrollToCTA} style={{ display:isMobile?"block":"inline-block", boxSizing:"border-box", textAlign:"center", textDecoration:"none", background:"#ea580c", color:"#fff", borderRadius:"12px", padding:"18px 48px", fontSize:"16px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 20px rgba(234,88,12,0.35)", fontFamily:"inherit" }}>
            QUERO GARANTIR MEU ACESSO →
          </a>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background:"#f9fafb", padding:`40px 20px ${isMobile?"80px":"80px"}` }}>
        <div style={{ maxWidth:isMobile?480:860, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <div style={{ display:"inline-block", border:"1.5px solid #ea580c", borderRadius:"100px", padding:"6px 18px", fontSize:"12px", fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", marginBottom:"14px" }}>DÚVIDAS FREQUENTES</div>
            <h2 style={{ fontSize:isMobile?"20px":"28px", fontWeight:900, textTransform:"uppercase" }}>PERGUNTAS FREQUENTES</h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"40px" }}>
            {faqs.map((f,i) => (
              <details key={i} className="faq" open={i===0}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <h3 style={{ fontSize:isMobile?"20px":"26px", fontWeight:900, marginBottom:"20px" }}>Pronto pra começar a lucrar?</h3>
            <a href="#cta-principal" onClick={scrollToCTA} style={{ display:isMobile?"block":"inline-block", boxSizing:"border-box", textAlign:"center", textDecoration:"none", background:"#ea580c", color:"#fff", borderRadius:"12px", padding:"18px 48px", fontSize:isMobile?"16px":"18px", fontWeight:800, textTransform:"uppercase", boxShadow:"0 4px 24px rgba(234,88,12,0.4)", fontFamily:"inherit", marginBottom:"12px" }}>
              QUERO ACESSO AGORA →
            </a>
            <p style={{ marginTop:"12px", fontSize:"11px", color:"#9ca3af" }}>🔒 Compra 100% segura • Acesso imediato • 7 dias de garantia</p>
          </div>
        </div>
      </div>

      {/* ── RODAPÉ ── */}
      <div style={{ background:"#111", padding:isMobile?"24px 20px":"32px 40px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ fontSize:"20px", fontWeight:900, color:"#ea580c", marginBottom:"12px" }}>
            Fornecedor<span style={{color:"#fff"}}>Vip</span>
          </div>
          <div style={{ display:"flex", flexDirection:isMobile?"column":"row", gap:"10px", justifyContent:"center", alignItems:"center" }}>
            <a href="mailto:contato@fornecedorvip.shop" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#fff", textDecoration:"none", fontSize:"14px", fontWeight:600, background:"rgba(255,255,255,0.08)", padding:"10px 18px", borderRadius:"100px" }}>
              ✉️ contato@fornecedorvip.shop
            </a>
            <a href="https://wa.me/5532998425801" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#fff", textDecoration:"none", fontSize:"14px", fontWeight:600, background:"#16a34a", padding:"10px 18px", borderRadius:"100px" }}>
              💬 WhatsApp: (32) 99842-5801
            </a>
          </div>
        </div>
      </div>

      <ExitIntentPopup isMobile={isMobile} />
    </div>
  );
}
