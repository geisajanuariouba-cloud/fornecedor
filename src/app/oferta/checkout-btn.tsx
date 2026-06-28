"use client";

const CHECKOUT_URL = "https://pay.wiapy.com/lzRXtuSG_Ku";
const PRICE_VALUE = 37.9;

declare global { interface Window { fbq?: (...args: unknown[]) => void; } }

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

let redirecting = false;
export function CheckoutBtn({ label, bar }: { label: string; bar?: boolean }) {
  function go(e: React.MouseEvent) {
    e.preventDefault();
    if (redirecting) return;
    redirecting = true;
    const eventId = `ic_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
    try { window.fbq?.("track","InitiateCheckout",PRODUCT_DATA,{eventID:eventId}); } catch { /**/ }
    const fbp = document.cookie.split(";").find(c=>c.trim().startsWith("_fbp="))?.split("=")[1]??"";
    const fbc = document.cookie.split(";").find(c=>c.trim().startsWith("_fbc="))?.split("=")[1]??"";
    fetch("/api/capi",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({fbp,fbc,url:window.location.href,event_id:eventId,value:PRICE_VALUE}),
      keepalive:true}).catch(()=>{});
    setTimeout(()=>{ window.location.href = buildCheckoutUrl(); },350);
  }

  if (bar) return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#ea580c",padding:"12px 20px",boxShadow:"0 -2px 12px rgba(0,0,0,0.15)",zIndex:50}}>
      <a href={CHECKOUT_URL} onClick={go} style={{width:"100%",maxWidth:"480px",margin:"0 auto",display:"block",boxSizing:"border-box",textAlign:"center",textDecoration:"none",background:"#fff",color:"#ea580c",borderRadius:"8px",padding:"14px",fontSize:"15px",fontWeight:800,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.5px",fontFamily:"inherit"}}>
        {label}
      </a>
    </div>
  );

  return (
    <a href={CHECKOUT_URL} onClick={go} style={{display:"block",boxSizing:"border-box",textAlign:"center",textDecoration:"none",width:"100%",background:"#22c55e",color:"#fff",borderRadius:"12px",padding:"18px",fontSize:"17px",fontWeight:800,cursor:"pointer",textTransform:"uppercase",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(34,197,94,0.35)",marginBottom:"10px"}}>
      {label}
    </a>
  );
}
