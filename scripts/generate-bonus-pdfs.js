const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(__dirname, "../bonus-pdfs");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Estilos base ────────────────────────────────────────────
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
  .page { width: 794px; min-height: 1123px; padding: 48px 56px; position: relative; page-break-after: always; }
  .orange { color: #ea580c; }
  .tag { display: inline-block; background: #ea580c; color: #fff; font-size: 11px; font-weight: 800;
    letter-spacing: .1em; padding: 4px 14px; border-radius: 100px; margin-bottom: 10px; }
  .header { display: flex; align-items: center; justify-content: space-between;
    border-bottom: 3px solid #ea580c; padding-bottom: 16px; margin-bottom: 32px; }
  .logo { font-size: 18px; font-weight: 900; letter-spacing: -.5px; }
  .logo span { color: #111; }
  .badge { font-size: 10px; font-weight: 700; color: #ea580c; border: 1.5px solid #ea580c;
    padding: 3px 10px; border-radius: 100px; }
  h1 { font-size: 30px; font-weight: 900; line-height: 1.2; margin-bottom: 8px; }
  h2 { font-size: 18px; font-weight: 800; margin: 28px 0 12px; color: #ea580c; }
  h3 { font-size: 14px; font-weight: 800; margin-bottom: 6px; }
  p, li { font-size: 13px; line-height: 1.7; color: #333; }
  ul { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
  ul li { display: flex; gap: 10px; align-items: flex-start; }
  ul li::before { content: '✅'; flex-shrink: 0; }
  .star-list li::before { content: '★'; color: #ea580c; flex-shrink: 0; }
  .num-list li::before { content: none; }
  .card { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; }
  .card h3 { color: #ea580c; }
  .highlight { background: #ea580c; color: #fff; border-radius: 10px; padding: 14px 20px; margin: 20px 0; }
  .highlight p { color: #fff; font-weight: 700; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .footer { position: absolute; bottom: 32px; left: 56px; right: 56px;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #f3f4f6; padding-top: 12px; }
  .footer span { font-size: 10px; color: #9ca3af; }
  .cover { background: linear-gradient(160deg, #1a0800 0%, #0f0f0f 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; min-height: 1123px; }
  .cover-emoji { font-size: 80px; margin-bottom: 24px; }
  .cover h1 { color: #fff; font-size: 36px; margin-bottom: 8px; }
  .cover .sub { color: rgba(255,255,255,.65); font-size: 15px; margin-bottom: 32px; }
  .cover .pill { background: #ea580c; color: #fff; font-size: 12px; font-weight: 800;
    padding: 8px 24px; border-radius: 100px; letter-spacing: .1em; }
  .cover .brand { color: #ea580c; font-weight: 900; font-size: 18px; margin-top: 48px; }
  .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .table th { background: #ea580c; color: #fff; font-size: 12px; font-weight: 800;
    padding: 10px 12px; text-align: left; }
  .table td { font-size: 12px; padding: 9px 12px; border-bottom: 1px solid #f3f4f6; color: #333; }
  .table tr:nth-child(even) td { background: #fff7ed; }
  .tip { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px;
    border-radius: 0 8px 8px 0; margin: 12px 0; }
  .tip p { color: #16a34a; font-weight: 600; }
  .warn { background: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 16px;
    border-radius: 0 8px 8px 0; margin: 12px 0; }
`;

function header(title, bonus) {
  return `
    <div class="header">
      <div class="logo"><span style="color:#ea580c">FORNECEDORES</span><span>VIP</span></div>
      <div class="badge">${bonus}</div>
    </div>`;
}

function footer(title, page, total) {
  return `
    <div class="footer">
      <span>${title}</span>
      <span>FornecedoresVIP © 2025</span>
      <span>Página ${page} de ${total}</span>
    </div>`;
}

// ════════════════════════════════════════════════════════════════
// PDF 01 — GUIA LOJA DE 10
// ════════════════════════════════════════════════════════════════
const pdf01 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<!-- CAPA -->
<div class="page cover">
  <div class="cover-emoji">🏪</div>
  <div class="tag">BÔNUS 01</div>
  <h1 class="cover h1" style="color:#fff;font-size:38px;margin-bottom:8px">GUIA LOJA DE 10</h1>
  <p class="sub">10 passos para montar sua loja virtual<br>e faturar seus primeiros R$1.000 na primeira semana</p>
  <div class="pill">ACESSO EXCLUSIVO</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<!-- PÁGINA 2 -->
<div class="page">
  ${header("Guia Loja de 10", "BÔNUS 01")}
  <div class="tag">INTRODUÇÃO</div>
  <h1>Sua loja virtual começa <span class="orange">hoje</span></h1>
  <p style="margin:12px 0 20px">Você não precisa de CNPJ, de muito dinheiro nem de experiência. Precisa de um celular, uma conta no marketplace e fornecedor certo. Esse guia te dá os 10 passos que separam quem só pensa em vender de quem já está faturando.</p>
  <div class="highlight"><p>💡 Dica importante: leia os 10 passos primeiro até o fim, depois volte e execute um por um. Muita gente trava porque tenta fazer tudo ao mesmo tempo.</p></div>
  <h2>Por que marketplace?</h2>
  <ul>
    <li>Mais de 70 milhões de compradores ativos no Mercado Livre</li>
    <li>Shopee cresce 40% ao ano — demanda enorme e pouca concorrência qualificada</li>
    <li>Amazon Brasil paga em até 14 dias — fluxo de caixa previsível</li>
    <li>Não precisa de site próprio, cartão de crédito da empresa nem nota fiscal</li>
    <li>Você vende para o Brasil inteiro desde o dia 1</li>
  </ul>
  ${footer("Guia Loja de 10", 2, 5)}
</div>

<!-- PÁGINA 3 -->
<div class="page">
  ${header("Guia Loja de 10", "BÔNUS 01")}
  <h2>PASSO 1 — Escolha sua plataforma</h2>
  <div class="two-col">
    <div class="card"><h3>🟡 Mercado Livre</h3><p>Maior marketplace do Brasil. Ideal para eletrônicos, roupas e acessórios. Comissão de 11% a 16%. Melhor para quem quer volume.</p></div>
    <div class="card"><h3>🟠 Shopee</h3><p>Crescimento acelerado, menor concorrência. Comissão de 6% a 14%. Ótimo para nichos de moda, bijuterias e papelaria.</p></div>
    <div class="card"><h3>🔵 Amazon</h3><p>Público com maior poder de compra. Comissão de 8% a 15%. Ideal para eletrônicos e suplementos premium.</p></div>
    <div class="card"><h3>📘 Facebook Marketplace</h3><p>Sem taxa de venda. Ideal para produtos de casa, roupas usadas e brinquedos. Venda local e nacional.</p></div>
  </div>
  <div class="tip"><p>✅ Recomendação: comece pelo Shopee ou Mercado Livre. São as plataformas com maior facilidade de aprovação de conta e menor burocracia para iniciantes.</p></div>

  <h2>PASSO 2 — Crie sua conta</h2>
  <ul class="num-list" style="gap:6px">
    <li style="display:flex;gap:10px"><span style="background:#ea580c;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">1</span><span>Acesse o site ou app da plataforma escolhida</span></li>
    <li style="display:flex;gap:10px"><span style="background:#ea580c;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">2</span><span>Cadastre com CPF e e-mail — sem CNPJ</span></li>
    <li style="display:flex;gap:10px"><span style="background:#ea580c;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">3</span><span>Complete seu perfil com foto e descrição profissional</span></li>
    <li style="display:flex;gap:10px"><span style="background:#ea580c;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">4</span><span>Configure dados bancários para receber pagamentos</span></li>
    <li style="display:flex;gap:10px"><span style="background:#ea580c;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">5</span><span>Ative o Mercado Envios ou Shopee Envios — o marketplace cuida do frete</span></li>
  </ul>
  ${footer("Guia Loja de 10", 3, 5)}
</div>

<!-- PÁGINA 4 -->
<div class="page">
  ${header("Guia Loja de 10", "BÔNUS 01")}
  <h2>PASSOS 3 a 7 — Produto, foto, preço e anúncio</h2>

  <div class="card">
    <h3>PASSO 3 — Escolha o produto certo</h3>
    <p>Use a lista de fornecedores para encontrar produtos com margem mínima de 60% após comissão e frete. Comece com 2 a 3 produtos, não com 20.</p>
  </div>
  <div class="card">
    <h3>PASSO 4 — Faça fotos que vendem</h3>
    <p>Fundo branco ou claro. Luz natural (janela). Mostre o produto de 4 ângulos. Use o app "Snapseed" para ajustar brilho e contraste de graça. Ou use IA (veja o Bônus 05).</p>
  </div>
  <div class="card">
    <h3>PASSO 5 — Precifique corretamente</h3>
    <p>Fórmula: <strong>Preço de venda = Custo ÷ (1 − comissão% − frete%)</strong><br>
    Exemplo: comprou por R$20, comissão 13%, frete R$8 → venda mínima: R$37. Mire em R$45 para ter margem real.</p>
  </div>
  <div class="card">
    <h3>PASSO 6 — Escreva um título que ranqueia</h3>
    <p>Fórmula: <strong>[produto] + [característica principal] + [para quem] + [benefício]</strong><br>
    Exemplo: "Conjunto Fitness Feminino Academia Cintura Alta Suplex Premium"</p>
  </div>
  <div class="card">
    <h3>PASSO 7 — Escreva a descrição</h3>
    <p>Repita as palavras-chave do título. Liste medidas, materiais e diferenciais. Termine com "Enviamos para todo Brasil via correios com rastreamento".</p>
  </div>
  ${footer("Guia Loja de 10", 4, 5)}
</div>

<!-- PÁGINA 5 -->
<div class="page">
  ${header("Guia Loja de 10", "BÔNUS 01")}
  <h2>PASSOS 8 a 10 — Venda, entrega e escala</h2>
  <div class="card">
    <h3>PASSO 8 — Publique e responda rápido</h3>
    <p>Responda perguntas em menos de 1 hora. O algoritmo favorece vendedores ativos. Ative as notificações do app no celular.</p>
  </div>
  <div class="card">
    <h3>PASSO 9 — Embalagem e entrega</h3>
    <p>Use caixas simples ou sacos plásticos reforçados. Coloque um bilhete escrito à mão agradecendo a compra — isso gera avaliação 5 estrelas. Poste em até 2 dias úteis.</p>
  </div>
  <div class="card">
    <h3>PASSO 10 — Reinvista e escale</h3>
    <p>Pegue o lucro da primeira semana e compre mais estoque do que vendeu. Aumente 2 produtos por semana. Em 30 dias você terá um catálogo sólido com vendas recorrentes.</p>
  </div>
  <div class="highlight">
    <p>🎯 META DA PRIMEIRA SEMANA: 1 produto cadastrado → 3 vendas → R$90 a R$150 de lucro líquido. É possível. Centenas de revendedores da nossa lista chegaram aqui na primeira semana.</p>
  </div>
  <h2>Checklist de lançamento</h2>
  <ul>
    <li>Conta criada e verificada na plataforma</li>
    <li>Produto escolhido com margem acima de 60%</li>
    <li>Fotos em fundo branco de pelo menos 4 ângulos</li>
    <li>Título com palavras-chave + benefício</li>
    <li>Preço calculado corretamente</li>
    <li>Frete configurado pelo marketplace</li>
  </ul>
  ${footer("Guia Loja de 10", 5, 5)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// PDF 02 — LISTA DOS PRODUTOS MAIS VENDIDOS
// ════════════════════════════════════════════════════════════════
const pdf02 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<div class="page cover">
  <div class="cover-emoji">🔥</div>
  <div class="tag">BÔNUS 02</div>
  <h1 style="color:#fff;font-size:34px;margin-bottom:8px">LISTA DOS PRODUTOS<br>MAIS VENDIDOS</h1>
  <p class="sub">Os produtos com maior saída nos marketplaces brasileiros<br>e onde encontrá-los na sua lista de fornecedores</p>
  <div class="pill">ATUALIZADO 2025</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<div class="page">
  ${header("Lista dos Produtos Mais Vendidos", "BÔNUS 02")}
  <div class="tag">COMO USAR ESTA LISTA</div>
  <h1>Os produtos certos fazem <span class="orange">toda a diferença</span></h1>
  <p style="margin:12px 0 20px">Vender no marketplace não é só ter produto — é ter o produto certo. Esta lista foi montada com base nos dados dos itens mais buscados e mais vendidos no Mercado Livre, Shopee e Amazon Brasil em 2025. Para cada categoria você vai encontrar o produto, o preço médio de atacado, o preço médio de venda e a margem estimada.</p>
  <div class="warn"><p>⚠️ As margens são estimativas. Podem variar de acordo com frete, embalagem e comissão da plataforma escolhida. Sempre calcule antes de comprar.</p></div>
  <h2>CATEGORIA 1 — ROUPAS</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Conjunto fitness feminino</td><td>R$22</td><td>R$59</td><td>~168%</td></tr>
    <tr><td>Calça jeans skinny feminina</td><td>R$35</td><td>R$89</td><td>~154%</td></tr>
    <tr><td>Vestido verão floral</td><td>R$28</td><td>R$75</td><td>~168%</td></tr>
    <tr><td>Conjunto pijama feminino</td><td>R$19</td><td>R$49</td><td>~158%</td></tr>
    <tr><td>Camisa polo masculina</td><td>R$24</td><td>R$65</td><td>~170%</td></tr>
  </table>
  <h2>CATEGORIA 2 — LINGERIE</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Kit 3 conjuntos lingerie básica</td><td>R$32</td><td>R$85</td><td>~165%</td></tr>
    <tr><td>Body rendado feminino</td><td>R$18</td><td>R$49</td><td>~172%</td></tr>
    <tr><td>Short-doll cetim</td><td>R$24</td><td>R$62</td><td>~158%</td></tr>
  </table>
  ${footer("Lista dos Produtos Mais Vendidos", 2, 4)}
</div>

<div class="page">
  ${header("Lista dos Produtos Mais Vendidos", "BÔNUS 02")}
  <h2>CATEGORIA 3 — ELETRÔNICOS E CELULARES</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Fone Bluetooth sem fio</td><td>R$28</td><td>R$79</td><td>~182%</td></tr>
    <tr><td>Suporte veicular celular</td><td>R$12</td><td>R$35</td><td>~191%</td></tr>
    <tr><td>Carregador turbo 65W</td><td>R$18</td><td>R$55</td><td>~205%</td></tr>
    <tr><td>Capa de celular personalizada</td><td>R$8</td><td>R$29</td><td>~262%</td></tr>
    <tr><td>Smartwatch barato</td><td>R$45</td><td>R$119</td><td>~164%</td></tr>
  </table>
  <h2>CATEGORIA 4 — BIJUTERIAS E SEMIJOIAS</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Conjunto colar + brinco dourado</td><td>R$14</td><td>R$45</td><td>~221%</td></tr>
    <tr><td>Anel ajustável em aço</td><td>R$6</td><td>R$22</td><td>~266%</td></tr>
    <tr><td>Pulseira feminina com pedras</td><td>R$9</td><td>R$28</td><td>~211%</td></tr>
    <tr><td>Brinco argola grande dourado</td><td>R$7</td><td>R$24</td><td>~242%</td></tr>
  </table>
  <h2>CATEGORIA 5 — MAQUIAGEM E COSMÉTICOS</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Kit base + corretivo</td><td>R$22</td><td>R$65</td><td>~195%</td></tr>
    <tr><td>Máscara de cílios volume</td><td>R$11</td><td>R$34</td><td>~209%</td></tr>
    <tr><td>Batom líquido matte</td><td>R$8</td><td>R$25</td><td>~212%</td></tr>
    <tr><td>Kit pincéis maquiagem 10 peças</td><td>R$19</td><td>R$56</td><td>~194%</td></tr>
  </table>
  ${footer("Lista dos Produtos Mais Vendidos", 3, 4)}
</div>

<div class="page">
  ${header("Lista dos Produtos Mais Vendidos", "BÔNUS 02")}
  <h2>CATEGORIA 6 — GAMES E BRINQUEDOS</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Controle para PS4/PS5 (réplica)</td><td>R$35</td><td>R$95</td><td>~171%</td></tr>
    <tr><td>Boneca articulada fashion</td><td>R$18</td><td>R$52</td><td>~188%</td></tr>
    <tr><td>Carrinho controle remoto</td><td>R$29</td><td>R$79</td><td>~172%</td></tr>
    <tr><td>Headset gamer com LED</td><td>R$42</td><td>R$115</td><td>~173%</td></tr>
  </table>
  <h2>CATEGORIA 7 — SUPLEMENTOS</h2>
  <table class="table">
    <tr><th>Produto</th><th>Atacado</th><th>Venda</th><th>Margem</th></tr>
    <tr><td>Whey protein concentrado 900g</td><td>R$48</td><td>R$129</td><td>~168%</td></tr>
    <tr><td>Creatina monohidratada 300g</td><td>R$32</td><td>R$89</td><td>~178%</td></tr>
    <tr><td>Colágeno + vitamina C</td><td>R$22</td><td>R$59</td><td>~168%</td></tr>
    <tr><td>Termogênico capsulas</td><td>R$19</td><td>R$54</td><td>~184%</td></tr>
  </table>
  <div class="highlight">
    <p>🎯 ESTRATÉGIA VENCEDORA: escolha 1 produto de cada categoria para testar. Com R$400 de investimento você tem um mix de 7 produtos e descobre o que funciona melhor para a sua operação em menos de 30 dias.</p>
  </div>
  <h2>Top 3 produtos para começar com menos de R$100</h2>
  <ul>
    <li><strong>Fone Bluetooth sem fio</strong> — Alta demanda, fácil de descrever, margem acima de 180%</li>
    <li><strong>Conjunto lingerie básica kit 3</strong> — Recompra frequente, cliente fiel</li>
    <li><strong>Conjunto colar + brinco dourado</strong> — Peso leve (frete barato), margem acima de 200%</li>
  </ul>
  ${footer("Lista dos Produtos Mais Vendidos", 4, 4)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// PDF 03 — PACOTE INFLUENCER PARA INSTAGRAM
// ════════════════════════════════════════════════════════════════
const pdf03 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<div class="page cover">
  <div class="cover-emoji">📸</div>
  <div class="tag">BÔNUS 03</div>
  <h1 style="color:#fff;font-size:34px;margin-bottom:8px">PACOTE INFLUENCER<br>PARA INSTAGRAM</h1>
  <p class="sub">Templates de legenda prontos, estratégia de conteúdo<br>e como vender sem precisar aparecer</p>
  <div class="pill">TEMPLATES PRONTOS PARA USAR</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<div class="page">
  ${header("Pacote Influencer para Instagram", "BÔNUS 03")}
  <div class="tag">ESTRATÉGIA</div>
  <h1>Venda no Instagram <span class="orange">sem aparecer</span></h1>
  <p style="margin:12px 0 16px">Você não precisa de câmera na cara, nem de dançar em Reels. Existem centenas de perfis faturando R$5.000 a R$20.000 por mês só com fotos de produtos e legendas bem escritas. Essa é a estratégia que vamos te ensinar aqui.</p>
  <h2>Os 3 pilares do perfil que vende</h2>
  <div class="two-col">
    <div class="card"><h3>📌 Pilar 1: Bio</h3><p>Diga quem você é, o que vende e como comprar em 3 linhas. Inclua um link para seu WhatsApp ou loja.</p></div>
    <div class="card"><h3>📸 Pilar 2: Foto</h3><p>Fundo branco ou neutro, produto bem iluminado. Consistência visual é mais importante que qualidade de câmera.</p></div>
    <div class="card"><h3>✍️ Pilar 3: Legenda</h3><p>Gatilho + benefício + prova social + chamada para ação. Use os templates desta página.</p></div>
    <div class="card"><h3>📅 Pilar 4: Frequência</h3><p>1 post por dia no feed + 3 stories. Constância bate perfeição. Poste mesmo que não seja perfeito.</p></div>
  </div>
  <h2>Como configurar seu bio</h2>
  <div class="card">
    <p><strong>Linha 1:</strong> O que você vende (ex: "Roupas femininas no atacado 👗")<br>
    <strong>Linha 2:</strong> Diferencial (ex: "Entrega para todo Brasil 📦")<br>
    <strong>Linha 3:</strong> CTA (ex: "👇 Clique e peça pelo WhatsApp")</p>
  </div>
  ${footer("Pacote Influencer para Instagram", 2, 4)}
</div>

<div class="page">
  ${header("Pacote Influencer para Instagram", "BÔNUS 03")}
  <h2>TEMPLATES DE LEGENDA — COPIE E ADAPTE</h2>

  <div class="card">
    <h3>Template 1 — Lançamento de produto</h3>
    <p>🔥 <strong>CHEGOU NOVIDADE!</strong><br><br>
    [Nome do produto] chegou e já está fazendo sucesso aqui na loja!<br>
    ✅ [Benefício 1]<br>
    ✅ [Benefício 2]<br>
    ✅ [Benefício 3]<br><br>
    🚚 Enviamos para todo o Brasil com rastreamento<br>
    💬 <strong>Chama no WhatsApp para garantir o seu 👇</strong><br>
    #[nicho] #comprasonline #[produto]</p>
  </div>

  <div class="card">
    <h3>Template 2 — Prova social</h3>
    <p>⭐⭐⭐⭐⭐ MAIS UMA CLIENTE SATISFEITA!<br><br>
    "Recebi o produto hoje e adorei! Qualidade incrível!" — [Nome]<br><br>
    Isso nos motiva a continuar trazendo o melhor para vocês 🙏<br>
    Quer fazer parte do nosso grupo de clientes satisfeitas?<br>
    👉 Link no bio ou chama no WhatsApp!</p>
  </div>

  <div class="card">
    <h3>Template 3 — Urgência</h3>
    <p>⚠️ <strong>ÚLTIMAS UNIDADES!</strong><br><br>
    O [produto] que vocês tanto pediram está quase esgotando.<br>
    Restam apenas [X] unidades em estoque.<br><br>
    💸 Por apenas R$[preço]<br>
    📦 Entrega em até 7 dias úteis<br><br>
    Não perde! Comenta QUERO aqui embaixo ou chama no direct 👇</p>
  </div>
  ${footer("Pacote Influencer para Instagram", 3, 4)}
</div>

<div class="page">
  ${header("Pacote Influencer para Instagram", "BÔNUS 03")}
  <div class="card">
    <h3>Template 4 — Story de venda (sequência de 3)</h3>
    <p><strong>Story 1:</strong> Foto do produto + "CHEGOU! 👀"<br>
    <strong>Story 2:</strong> Foto mostrando detalhes + preço + benefícios<br>
    <strong>Story 3:</strong> Sticker de enquete "Você quer?" SIM / NÃO — quem clicou SIM, entre no DM automaticamente</p>
  </div>
  <div class="card">
    <h3>Template 5 — Reels sem aparecer</h3>
    <p>Grave um vídeo do produto sendo desembalado ou na mão (sem mostrar rosto).<br>
    Adicione uma música trending do momento.<br>
    Texto na tela: "POV: você encontrou o [produto] mais lindo por R$[preço]" 🔥</p>
  </div>

  <h2>Hashtags por nicho</h2>
  <div class="two-col">
    <div class="card">
      <h3>Moda Feminina</h3>
      <p style="font-size:11px">#modafeminina #roupasfemininas #lookdodia #modaatacado #vestido #conjuntofeminino #modaonline #moda2025</p>
    </div>
    <div class="card">
      <h3>Bijuterias</h3>
      <p style="font-size:11px">#bijuterias #semijoia #acessoriosfemininos #colares #brincos #pulseiras #joias #bijoux</p>
    </div>
    <div class="card">
      <h3>Eletrônicos</h3>
      <p style="font-size:11px">#eletronicos #celular #fone #bluetooth #tecnologia #gadgets #acessorioscelular #tech</p>
    </div>
    <div class="card">
      <h3>Maquiagem</h3>
      <p style="font-size:11px">#maquiagem #makeup #beleza #cosmeticos #skincare #maquiagembarata #makeupbrasil</p>
    </div>
  </div>

  <div class="highlight">
    <p>🎯 META SEMANAL: 7 posts no feed + 21 stories + responder TODOS os comentários. Em 30 dias você terá um perfil ativo que o algoritmo vai mostrar organicamente.</p>
  </div>
  ${footer("Pacote Influencer para Instagram", 4, 4)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// PDF 04 — CATÁLOGO DE TENDÊNCIAS
// ════════════════════════════════════════════════════════════════
const pdf04 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<div class="page cover">
  <div class="cover-emoji">📊</div>
  <div class="tag">BÔNUS 04</div>
  <h1 style="color:#fff;font-size:34px;margin-bottom:8px">CATÁLOGO DE<br>TENDÊNCIAS 2025</h1>
  <p class="sub">O que vai vender mais nos próximos meses<br>e como se posicionar antes da concorrência</p>
  <div class="pill">TENDÊNCIAS VERIFICADAS</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<div class="page">
  ${header("Catálogo de Tendências 2025", "BÔNUS 04")}
  <div class="tag">POR QUE TENDÊNCIAS IMPORTAM</div>
  <h1>Compre <span class="orange">antes</span>, venda <span class="orange">mais caro</span></h1>
  <p style="margin:12px 0 20px">Quem chega primeiro no produto certo paga menos (estoque disponível) e vende mais (menos concorrência). Quem chega atrasado briga por preço. Use este catálogo para se antecipar 30 a 60 dias à curva de demanda.</p>

  <h2>🔥 TENDÊNCIAS QUENTES — MODA</h2>
  <div class="card"><h3>Conjunto Linho Feminino</h3><p>O linho domina o verão 2025. Conjuntos calça + blusa em bege, off-white e terracota. Procura subiu 340% no último trimestre. Fornecedores da lista: Rovitex, Hilda Atacado.</p></div>
  <div class="card"><h3>Vestido Midi Floral</h3><p>Alta procura no Mercado Livre e Shopee entre março e setembro. Cores quentes (laranja, vermelho, amarelo). Margem média de 170%. </p></div>
  <div class="card"><h3>Conjunto Fitness Cropped + Legging</h3><p>Evergreen (vende o ano todo) com pico entre janeiro e março. Tecido suplex com proteção UV é o diferencial que mais vende.</p></div>

  <h2>📱 TENDÊNCIAS — ELETRÔNICOS</h2>
  <div class="card"><h3>Fone TWS (True Wireless Stereo)</h3><p>Substituto do fone com fio. Margem acima de 200%. Versões com cancelamento de ruído saem por R$129 a R$199 no varejo — custo de atacado entre R$35 e R$55.</p></div>
  <div class="card"><h3>Mini Projetor Portátil</h3><p>Nicho crescendo no Instagram. Produto visual, fácil de vender com vídeo. Atacado a partir de R$89, venda acima de R$229.</p></div>
  ${footer("Catálogo de Tendências 2025", 2, 4)}
</div>

<div class="page">
  ${header("Catálogo de Tendências 2025", "BÔNUS 04")}
  <h2>💎 TENDÊNCIAS — BIJUTERIAS E ACESSÓRIOS</h2>
  <div class="card"><h3>Correntes Grossas Douradas</h3><p>Estética "bold" em alta. Correntes curtas e grossas em aço ou banhado. Margem acima de 250%. Baixo peso = frete barato = maior lucro.</p></div>
  <div class="card"><h3>Anel Minimalista Empilhável</h3><p>Kit com 3 ou 5 anéis finos. Estratégia de kit aumenta ticket médio. Kit de 5 peças sai de R$15 no atacado e vende por R$49 a R$65.</p></div>
  <div class="card"><h3>Brinco Ear Cuff</h3><p>Não precisa de furo na orelha — alcance maior de público. Procura triplicou em 2024 e segue em alta para 2025.</p></div>

  <h2>💄 TENDÊNCIAS — MAQUIAGEM</h2>
  <div class="card"><h3>Base de Longa Duração Leve</h3><p>Cobertura média com acabamento natural é o que mais vende. Base "skin tint" é a palavra-chave de maior busca em 2025.</p></div>
  <div class="card"><h3>Batom Marrom / Nude Escuro</h3><p>Tendência que veio para ficar. Tons de marrom e terracota nas versões líquida matte lideram as buscas no Instagram e TikTok.</p></div>
  <div class="card"><h3>Esponja de Maquiagem Premium</h3><p>Produto de baixo custo (R$6 a R$12 no atacado) com alta demanda e recompra frequente. Venda unitária ou em kit com 3 unidades.</p></div>

  <h2>🎮 TENDÊNCIAS — GAMES E ENTRETENIMENTO</h2>
  <div class="card"><h3>Controles para Nintendo / PC</h3><p>Mercado PC gaming cresceu 60% em 2024. Controles compatíveis com PC + Android saem de R$28 no atacado e vendem por R$79 a R$99.</p></div>
  ${footer("Catálogo de Tendências 2025", 3, 4)}
</div>

<div class="page">
  ${header("Catálogo de Tendências 2025", "BÔNUS 04")}
  <h2>📅 CALENDÁRIO ESTRATÉGICO 2025</h2>
  <table class="table">
    <tr><th>Período</th><th>Categoria em Alta</th><th>Produto Recomendado</th></tr>
    <tr><td>Jan–Fev</td><td>Fitness e Suplementos</td><td>Conjunto academia + whey</td></tr>
    <tr><td>Mar–Abr</td><td>Moda Verão / Praia</td><td>Biquíni + saída de praia</td></tr>
    <tr><td>Mai–Jun</td><td>Dia das Mães</td><td>Kits perfume + bijuteria</td></tr>
    <tr><td>Jul–Ago</td><td>Inverno / Frio</td><td>Tricot, moletom, pijama</td></tr>
    <tr><td>Set–Out</td><td>Crianças e Games</td><td>Brinquedos + controles</td></tr>
    <tr><td>Nov–Dez</td><td>Black Friday + Natal</td><td>Eletrônicos + kits presente</td></tr>
  </table>

  <div class="highlight">
    <p>🚀 ESTRATÉGIA PRO: compre os produtos de cada período com 45 dias de antecedência. Quando a concorrência percebe a demanda e vai buscar estoque, o seu já está pronto para entregar.</p>
  </div>

  <h2>Como identificar tendências por conta própria</h2>
  <ul class="star-list">
    <li>Google Trends: compare termos de busca nos últimos 12 meses</li>
    <li>TikTok: procure hashtags como #tiktokshop e #compras — o que está viralizado hoje chega ao marketplace em 30 dias</li>
    <li>Mercado Livre: filtre por "mais vendidos" em cada categoria</li>
    <li>Instagram Explore: observe o que aparece nos anúncios de lojinhas — se estão anunciando, é porque está vendendo</li>
    <li>Grupos de WhatsApp de revendedores: quem já vende te conta o que está saindo</li>
  </ul>
  ${footer("Catálogo de Tendências 2025", 4, 4)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// PDF 05 — COMO GERAR IMAGENS COM IA
// ════════════════════════════════════════════════════════════════
const pdf05 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<div class="page cover">
  <div class="cover-emoji">🤖</div>
  <div class="tag">BÔNUS 05</div>
  <h1 style="color:#fff;font-size:34px;margin-bottom:8px">COMO GERAR<br>IMAGENS COM IA</h1>
  <p class="sub">Fotos profissionais dos seus produtos<br>sem fotógrafo, sem modelo e sem gastar nada</p>
  <div class="pill">FERRAMENTAS GRATUITAS</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<div class="page">
  ${header("Como Gerar Imagens com IA", "BÔNUS 05")}
  <div class="tag">POR QUE IA MUDA O JOGO</div>
  <h1>Foto profissional <span class="orange">sem fotógrafo</span></h1>
  <p style="margin:12px 0 16px">A foto é o que decide se o cliente clica ou rola. Uma foto ruim mata um produto excelente. Uma foto boa vende até produto mediano. Com IA você cria fotos de catálogo, mockups de uso e banners em minutos — e muitas ferramentas são gratuitas.</p>

  <h2>🛠️ Ferramentas recomendadas (gratuitas)</h2>
  <div class="card">
    <h3>1. Remove.bg — Remover fundo</h3>
    <p>Site: remove.bg — Tire a foto do produto com qualquer celular, cole no site e em segundos o fundo é removido. Resultado: produto no fundo branco profissional. Gratuito para até 50 fotos/mês.</p>
  </div>
  <div class="card">
    <h3>2. Canva IA — Gerar e editar imagens</h3>
    <p>Site: canva.com — Use o "Magic Studio" do Canva para adicionar o produto a cenários (mesa de madeira, arara de loja, fundo minimalista). Plano gratuito já inclui os recursos básicos de IA.</p>
  </div>
  <div class="card">
    <h3>3. Adobe Firefly — Geração de fundo</h3>
    <p>Site: firefly.adobe.com — Faça o upload da foto do produto sem fundo e gere um cenário profissional com texto. Ex: "produto em mesa de madeira com luz natural suave". Gratuito com 25 créditos/mês.</p>
  </div>
  <div class="card">
    <h3>4. Microsoft Designer — Banners prontos</h3>
    <p>Site: designer.microsoft.com — Gera banners de produto completos com texto e fundo a partir de uma descrição. Gratuito e em português.</p>
  </div>
  ${footer("Como Gerar Imagens com IA", 2, 4)}
</div>

<div class="page">
  ${header("Como Gerar Imagens com IA", "BÔNUS 05")}
  <h2>Passo a passo: foto de produto profissional em 10 minutos</h2>

  <ul class="num-list" style="gap:10px">
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">1</span><div><strong>Tire a foto com o celular:</strong> coloque o produto em cima de uma folha de papel branco A4, perto de uma janela. Tire a foto de frente e de cima. Resolução mínima: 1080px.</div></li>
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">2</span><div><strong>Remova o fundo no remove.bg:</strong> acesse o site, faça o upload e baixe a imagem PNG sem fundo em menos de 30 segundos.</div></li>
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">3</span><div><strong>Abra no Canva:</strong> crie um design quadrado (1080x1080px). Adicione a imagem do produto. Escolha um fundo simples — branco para marketplace, cor temática para Instagram.</div></li>
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">4</span><div><strong>Use o Magic Edit do Canva:</strong> clique em "Editar foto" → "Magic Edit" → descreva o cenário que quer: "mesa de madeira clara", "arara de loja boutique", "fundo degradê bege".</div></li>
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">5</span><div><strong>Adicione texto (opcional):</strong> para Instagram, adicione o preço e um emoji. Para marketplace, deixe só o produto sem texto.</div></li>
    <li style="display:flex;gap:12px;align-items:flex-start"><span style="background:#ea580c;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">6</span><div><strong>Baixe em alta resolução:</strong> exporte em JPG na maior resolução disponível.</div></li>
  </ul>
  ${footer("Como Gerar Imagens com IA", 3, 4)}
</div>

<div class="page">
  ${header("Como Gerar Imagens com IA", "BÔNUS 05")}
  <h2>Prompts prontos para gerar cenários</h2>
  <p style="margin-bottom:14px">Use estes textos no Canva Magic Edit, Adobe Firefly ou qualquer ferramenta de IA de imagem:</p>

  <div class="card"><h3>🛍️ Para roupas e lingerie</h3><p>"Flat lay de roupa feminina em cama com lençol branco e flores secas, luz natural suave, fotografia de produto profissional, fundo minimalista"</p></div>
  <div class="card"><h3>💍 Para bijuterias e acessórios</h3><p>"Bijuteria dourada sobre mármore branco com pétalas de rosa, fotografia de produto de luxo, iluminação suave de estúdio, fundo limpo"</p></div>
  <div class="card"><h3>📱 Para eletrônicos</h3><p>"Fone de ouvido bluetooth em mesa de madeira escura com plantas ao fundo desfocadas, luz natural da janela, estilo fotografia tech minimalista"</p></div>
  <div class="card"><h3>💄 Para maquiagem</h3><p>"Kit de maquiagem organizado em bancada rosa com espelho redondo e luz natural, estilo flatlay beauty editorial profissional"</p></div>
  <div class="card"><h3>🍎 Para alimentos</h3><p>"Produto alimentício em tábua de madeira rústica com ervas frescas ao redor, luz dourada de fim de tarde, fotografia gastronômica profissional"</p></div>

  <div class="highlight">
    <p>💡 DICA EXTRA: crie um "Highlight" no Instagram chamado "Depoimentos" e adicione todos os stories com avaliações de clientes. Isso funciona como prova social 24 horas por dia para quem visita seu perfil pela primeira vez.</p>
  </div>
  ${footer("Como Gerar Imagens com IA", 4, 4)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// PDF 06 — GRUPOS E COMUNIDADES NO WHATSAPP
// ════════════════════════════════════════════════════════════════
const pdf06 = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style></head><body>

<div class="page cover">
  <div class="cover-emoji">💬</div>
  <div class="tag">BÔNUS 06</div>
  <h1 style="color:#fff;font-size:34px;margin-bottom:8px">GRUPOS E COMUNIDADES<br>NO WHATSAPP</h1>
  <p class="sub">Contato direto com fornecedores, revendedores<br>e comunidades de atacado em tempo real</p>
  <div class="pill">ACESSO DIRETO AOS FORNECEDORES</div>
  <div class="brand">FORNECEDORES<span style="color:#fff">VIP</span></div>
</div>

<div class="page">
  ${header("Grupos e Comunidades no WhatsApp", "BÔNUS 06")}
  <div class="tag">POR QUE GRUPOS FAZEM A DIFERENÇA</div>
  <h1>A vantagem de quem <span class="orange">está dentro</span></h1>
  <p style="margin:12px 0 20px">Nos grupos e comunidades do WhatsApp os fornecedores postam promoções relâmpago, liquidações de estoque, novidades de coleção e condições especiais que não aparecem no site. Quem está dentro compra antes, mais barato e com vantagens exclusivas.</p>
  <div class="highlight"><p>📲 Os grupos e comunidades são atualizados constantemente. Fique atento às notificações para não perder as promoções relâmpago que duram poucas horas.</p></div>

  <h2>Como entrar nos grupos</h2>
  <div class="card">
    <h3>Passo 1 — Salve o número</h3>
    <p>Antes de entrar em qualquer grupo, salve o número do fornecedor na agenda com o nome da empresa. Isso evita ser removido por "número desconhecido" em alguns grupos privados.</p>
  </div>
  <div class="card">
    <h3>Passo 2 — Apresente-se ao entrar</h3>
    <p>Ao entrar em um grupo novo, envie uma mensagem de apresentação: "Olá! Sou [nome], revendedora de [nicho]. Vim pelo grupo de fornecedores para acompanhar as novidades. 🙏" Isso cria conexão e evita que te removam.</p>
  </div>
  <div class="card">
    <h3>Passo 3 — Interaja com frequência</h3>
    <p>Responda stories de fornecedores, tire dúvidas nos grupos, peça catálogos. Quem interage recebe condições melhores na hora de negociar pedidos maiores.</p>
  </div>
  ${footer("Grupos e Comunidades no WhatsApp", 2, 4)}
</div>

<div class="page">
  ${header("Grupos e Comunidades no WhatsApp", "BÔNUS 06")}
  <h2>Como negociar via WhatsApp com fornecedores</h2>
  <div class="card">
    <h3>Script de primeiro contato</h3>
    <p>Olá, [nome do fornecedor]! Vi o catálogo de vocês e tenho interesse em [produto específico].<br><br>
    Poderia me informar:<br>
    ✅ Pedido mínimo para compra<br>
    ✅ Formas de pagamento aceitas<br>
    ✅ Prazo de entrega para [sua cidade/estado]<br>
    ✅ Valor do frete<br><br>
    Tenho interesse em começar um pedido nesta semana. Aguardo retorno! 🙏</p>
  </div>
  <div class="card">
    <h3>Script para negociar desconto</h3>
    <p>Olá! Sou cliente frequente de vocês e estou planejando um pedido maior desta vez — em torno de R$[valor]. Vocês conseguem algum desconto ou condição especial para pedidos acima desse valor?<br><br>
    Se sim, pode me passar o catálogo com as condições? Obrigada!</p>
  </div>
  <div class="card">
    <h3>Script para pedido recorrente</h3>
    <p>Oi [nome]! Quero renovar o pedido de [produto]. A última remessa vendeu muito bem 🎉 Desta vez quero [quantidade]. Qual o valor e o prazo? Posso pagar via Pix assim que você confirmar.</p>
  </div>

  <h2>Comunidades no WhatsApp — como encontrar</h2>
  <ul>
    <li>Busque no Google: "grupo whatsapp fornecedores atacado [categoria] 2025"</li>
    <li>Acesse o Telegram e busque grupos de atacadistas da sua categoria</li>
    <li>Peça ao fornecedor quando fizer o primeiro contato: "Vocês têm grupo de WhatsApp com promoções?"</li>
    <li>Participe de grupos de revendedoras — elas indicam os melhores fornecedores e grupos</li>
  </ul>
  ${footer("Grupos e Comunidades no WhatsApp", 3, 4)}
</div>

<div class="page">
  ${header("Grupos e Comunidades no WhatsApp", "BÔNUS 06")}
  <h2>Contatos diretos por categoria</h2>
  <p style="margin-bottom:16px">Os fornecedores da lista principal já têm WhatsApp e site listados. Abaixo, algumas orientações por categoria para facilitar seu contato:</p>

  <table class="table">
    <tr><th>Categoria</th><th>Melhor forma de contato</th><th>Dica</th></tr>
    <tr><td>Roupas</td><td>WhatsApp + site</td><td>Peça catálogo PDF atualizado</td></tr>
    <tr><td>Lingerie</td><td>WhatsApp direto</td><td>Pergunte sobre grade completa</td></tr>
    <tr><td>Eletrônicos</td><td>Site + e-mail</td><td>Exija nota fiscal e garantia</td></tr>
    <tr><td>Bijuterias</td><td>WhatsApp + Instagram</td><td>Peça kit amostra antes de grande pedido</td></tr>
    <tr><td>Maquiagem</td><td>WhatsApp</td><td>Pergunte sobre validade dos produtos</td></tr>
    <tr><td>Games</td><td>Site + WhatsApp</td><td>Verifique compatibilidade dos produtos</td></tr>
    <tr><td>Suplementos</td><td>Site oficial</td><td>Exija registro ANVISA</td></tr>
    <tr><td>Alimentos</td><td>WhatsApp</td><td>Pergunte sobre prazo de validade do lote</td></tr>
  </table>

  <div class="highlight">
    <p>🌟 DICA FINAL: crie um grupo ou lista de transmissão no WhatsApp com seus próprios clientes. Assim quando chegar novidade do fornecedor você já avisa na hora — e vende antes mesmo de ter o estoque em mãos (venda sob encomenda).</p>
  </div>

  <div class="tip"><p>✅ Lembre-se: relacionamento é tudo no mundo do atacado. Fornecedores que te conhecem dão prioridade no estoque limitado, condições de prazo e avisos de liquidação exclusivos.</p></div>
  ${footer("Grupos e Comunidades no WhatsApp", 4, 4)}
</div>
</body></html>`;

// ════════════════════════════════════════════════════════════════
// Geração dos PDFs
// ════════════════════════════════════════════════════════════════
const docs = [
  { name: "bonus-01-guia-loja-de-10.pdf", html: pdf01 },
  { name: "bonus-02-produtos-mais-vendidos.pdf", html: pdf02 },
  { name: "bonus-03-pacote-influencer-instagram.pdf", html: pdf03 },
  { name: "bonus-04-catalogo-tendencias.pdf", html: pdf04 },
  { name: "bonus-05-imagens-com-ia.pdf", html: pdf05 },
  { name: "bonus-06-grupos-whatsapp.pdf", html: pdf06 },
];

(async () => {
  console.log("🚀 Iniciando geração dos PDFs...\n");
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();

  for (const doc of docs) {
    const outPath = path.join(OUT_DIR, doc.name);
    await page.setContent(doc.html, { waitUntil: "domcontentloaded" });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    console.log(`✅ ${doc.name}`);
  }

  await browser.close();
  console.log(`\n🎉 Todos os PDFs gerados em: ${OUT_DIR}`);
})();
