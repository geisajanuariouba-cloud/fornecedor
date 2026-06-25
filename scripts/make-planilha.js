const ExcelJS = require("exceljs");
const fs = require("fs");

// Paleta conforme especificação
const HEADER = "FF166534";      // verde escuro
const HEADER_TXT = "FFFFFFFF";
const INPUT = "FFFEF9C3";        // amarelo claro (campos de digitar)
const CALC = "FFF3F4F6";         // cinza claro (cálculo automático)
const GREEN = "FF15803D";
const DARK = "FF111111";
const GREY = "FF6B7280";
const BLUE = "FF1D4ED8";
const FONT = "Calibri";
const BRL = '"R$" #,##0.00';
const PCT = "0.0%";

const thin = { style: "thin", color: { argb: "FFD1D5DB" } };
const border = { top: thin, left: thin, right: thin, bottom: thin };
const fill = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const wb = new ExcelJS.Workbook();

function head(cell, text) {
  cell.value = text;
  cell.font = { name: FONT, bold: true, color: { argb: HEADER_TXT }, size: 11 };
  cell.fill = fill(HEADER);
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  cell.border = border;
}
function inputCell(cell, val, fmt, align = "center") {
  if (val !== undefined && val !== null) cell.value = val;
  cell.fill = fill(INPUT);
  cell.font = { name: FONT, color: { argb: BLUE }, size: 11 };
  if (fmt) cell.numFmt = fmt;
  cell.alignment = { horizontal: align, vertical: "middle" };
  cell.border = border;
}
function calcCell(cell, formula, fmt, opts = {}) {
  cell.value = { formula };
  cell.fill = fill(CALC);
  cell.font = { name: FONT, size: 11, bold: !!opts.bold, color: { argb: opts.color || DARK } };
  if (fmt) cell.numFmt = fmt;
  cell.alignment = { horizontal: opts.align || "center", vertical: "middle" };
  cell.border = border;
}
function title(ws, range, text) {
  ws.mergeCells(range);
  const c = ws.getCell(range.split(":")[0]);
  c.value = text;
  c.font = { name: FONT, bold: true, size: 12, color: { argb: GREEN } };
}

// ═══════════════ ABA 1: INÍCIO (guia rápido) ═══════════════
let ws = wb.addWorksheet("Início", { views: [{ showGridLines: false }] });
ws.getColumn(1).width = 2; ws.getColumn(2).width = 92;
ws.getCell("B2").value = "FORNECEDORVIP";
ws.getCell("B2").font = { name: FONT, bold: true, size: 20, color: { argb: GREEN } };
ws.getCell("B3").value = "Planilha de Controle + Precificação";
ws.getCell("B3").font = { name: FONT, bold: true, size: 14, color: { argb: DARK } };
const intro = [
  ["", ""],
  ["COMO USAR — leva 2 minutos", "h"],
  ["Amarelo = você digita.  Cinza = a planilha calcula sozinha.  Verde escuro = cabeçalho.", "t"],
  ["", ""],
  ["1) ESTOQUE — cadastre seus produtos, fornecedor e custo. O estoque atual se atualiza sozinho.", "b"],
  ["2) PRECIFICAÇÃO — informe custo, taxa e margem. Ela calcula o preço ideal e o lucro.", "b"],
  ["3) CONTROLE DE VENDAS — anote cada venda. Receita, custo e lucro são automáticos (o custo é puxado do Estoque/Precificação).", "b"],
  ["4) RESUMO FINANCEIRO — vê tudo somado: receita, custo, lucro, produto e plataforma campeões.", "b"],
  ["", ""],
  ["DICA: use sempre o MESMO nome de produto nas abas, para o cálculo automático funcionar.", "tip"],
];
let r = 5;
for (const [text, kind] of intro) {
  const c = ws.getCell(`B${r}`); c.value = text;
  if (kind === "h") c.font = { name: FONT, bold: true, size: 13, color: { argb: GREEN } };
  else if (kind === "b") { c.font = { name: FONT, size: 11.5, color: { argb: "FF333333" } }; c.alignment = { wrapText: true, vertical: "top" }; ws.getRow(r).height = 32; }
  else if (kind === "t") { c.font = { name: FONT, size: 11, italic: true, color: { argb: GREY } }; }
  else if (kind === "tip") { c.font = { name: FONT, bold: true, size: 11, color: { argb: GREEN } }; c.fill = fill("FFF0FDF4"); c.alignment = { wrapText: true, vertical: "middle" }; c.border = border; ws.getRow(r).height = 28; }
  r++;
}

// ═══════════════ ABA 2: CONTROLE DE ESTOQUE ═══════════════
ws = wb.addWorksheet("Controle de Estoque", { views: [{ showGridLines: false }] });
title(ws, "A1:G1", "CONTROLE DE ESTOQUE — preencha o amarelo; o estoque atual se calcula sozinho");
const e1 = ["Nome do produto", "Fornecedor", "Preço de custo (R$)", "Qtd comprada", "Qtd vendida", "Qtd em estoque", "Data da compra"];
[28, 22, 15, 13, 13, 14, 15].forEach((w, i) => ws.getColumn(i + 1).width = w);
e1.forEach((h, i) => head(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 30;
const estoqueEx = [
  ["Conjunto fitness", "Moda Fit Atacado", 22, 50, 30, "10/01/2026"],
  ["Perfume importado 50ml", "Essência Imports", 35, 30, 12, "05/02/2026"],
  ["Kit maquiagem", "Beauty Atacado", 28, 40, 25, "20/02/2026"],
];
const ES_F = 3, ES_L = 52;
for (let i = ES_F; i <= ES_L; i++) {
  const ex = estoqueEx[i - ES_F];
  inputCell(ws.getCell(i, 1), ex ? ex[0] : null, null, "left");
  inputCell(ws.getCell(i, 2), ex ? ex[1] : null, null, "left");
  inputCell(ws.getCell(i, 3), ex ? ex[2] : null, BRL);
  inputCell(ws.getCell(i, 4), ex ? ex[3] : null, "0");
  inputCell(ws.getCell(i, 5), ex ? ex[4] : null, "0");
  calcCell(ws.getCell(i, 6), `IF(A${i}="","",D${i}-E${i})`, "0", { bold: true });
  inputCell(ws.getCell(i, 7), ex ? ex[5] : null, null);
}

// ═══════════════ ABA 3: PRECIFICAÇÃO ═══════════════
ws = wb.addWorksheet("Precificação", { views: [{ showGridLines: false }] });
title(ws, "A1:I1", "PRECIFICAÇÃO — informe custo, taxa, frete e margem; o resto é automático");
const p1 = ["Nome do produto", "Preço de\ncusto (R$)", "Taxa da\nplataforma (%)", "Frete\nestimado (R$)", "Margem\ndesejada (%)", "Preço mínimo\nde venda (R$)", "Preço sugerido\nde venda (R$)", "Lucro por\nunidade (R$)", "Lucro por\nunidade (%)"];
[26, 12, 13, 12, 12, 14, 15, 13, 12].forEach((w, i) => ws.getColumn(i + 1).width = w);
p1.forEach((h, i) => head(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 38;
const precoEx = [
  ["Conjunto fitness", 22, 0.20, 8, 0.30],
  ["Perfume importado 50ml", 35, 0.16, 6, 0.35],
  ["Kit maquiagem", 28, 0.20, 7, 0.30],
];
const PR_F = 3, PR_L = 52;
for (let i = PR_F; i <= PR_L; i++) {
  const ex = precoEx[i - PR_F];
  inputCell(ws.getCell(i, 1), ex ? ex[0] : null, null, "left");
  inputCell(ws.getCell(i, 2), ex ? ex[1] : null, BRL);
  inputCell(ws.getCell(i, 3), ex ? ex[2] : null, PCT);
  inputCell(ws.getCell(i, 4), ex ? ex[3] : null, BRL);
  inputCell(ws.getCell(i, 5), ex ? ex[4] : null, PCT);
  // Preço mínimo (sem lucro) = (custo+frete)/(1-taxa)
  calcCell(ws.getCell(i, 6), `IFERROR(IF(B${i}="","",(B${i}+D${i})/(1-C${i})),"rever %")`, BRL);
  // Preço sugerido = (custo+frete)/(1-taxa-margem)
  calcCell(ws.getCell(i, 7), `IFERROR(IF(B${i}="","",(B${i}+D${i})/(1-C${i}-E${i})),"rever %")`, BRL, { bold: true, color: GREEN });
  // Lucro R$ = sugerido - custo - frete - sugerido*taxa
  calcCell(ws.getCell(i, 8), `IFERROR(IF(G${i}="","",G${i}-B${i}-D${i}-G${i}*C${i}),"")`, BRL);
  // Lucro % = lucro/sugerido
  calcCell(ws.getCell(i, 9), `IFERROR(IF(G${i}="","",H${i}/G${i}),"")`, PCT);
}
title(ws, `A${PR_L + 2}:I${PR_L + 2}`, "Taxas comuns: Shopee ~20%  |  Mercado Livre ~16%  |  WhatsApp / Instagram = 0%");
ws.getCell(`A${PR_L + 2}`).font = { name: FONT, italic: true, size: 10, color: { argb: GREY } };

// ═══════════════ ABA 4: CONTROLE DE VENDAS ═══════════════
ws = wb.addWorksheet("Controle de Vendas", { views: [{ showGridLines: false }] });
title(ws, "A1:H1", "CONTROLE DE VENDAS — anote a venda; receita, custo e lucro são automáticos");
const v1 = ["Data", "Produto", "Plataforma", "Qtd vendida", "Preço de\nvenda (R$)", "Receita\ntotal (R$)", "Custo\ntotal (R$)", "Lucro da\nvenda (R$)"];
[13, 26, 16, 12, 13, 14, 13, 14].forEach((w, i) => ws.getColumn(i + 1).width = w);
v1.forEach((h, i) => head(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 32;
const ES = "'Controle de Estoque'";
const PRf = "Precificação";
const vendaEx = [
  ["12/02/2026", "Conjunto fitness", "Shopee", 3, 60],
  ["15/02/2026", "Perfume importado 50ml", "Instagram", 2, 83.67],
  ["18/02/2026", "Kit maquiagem", "WhatsApp", 1, 70],
];
const VE_F = 3, VE_L = 202;
for (let i = VE_F; i <= VE_L; i++) {
  const ex = vendaEx[i - VE_F];
  inputCell(ws.getCell(i, 1), ex ? ex[0] : null);
  inputCell(ws.getCell(i, 2), ex ? ex[1] : null, null, "left");
  inputCell(ws.getCell(i, 3), ex ? ex[2] : null);
  inputCell(ws.getCell(i, 4), ex ? ex[3] : null, "0");
  inputCell(ws.getCell(i, 5), ex ? ex[4] : null, BRL);
  // Receita = qtd * preço
  calcCell(ws.getCell(i, 6), `IF(D${i}="","",D${i}*E${i})`, BRL);
  // Custo total = qtd * custo (PROCV no Estoque, fallback Precificação)
  const lookupCost = `IFERROR(VLOOKUP(B${i},${ES}!$A$3:$C$52,3,0),IFERROR(VLOOKUP(B${i},${PRf}!$A$3:$B$52,2,0),0))`;
  calcCell(ws.getCell(i, 7), `IF(D${i}="","",D${i}*${lookupCost})`, BRL);
  // Lucro = receita - custo
  calcCell(ws.getCell(i, 8), `IF(D${i}="","",F${i}-G${i})`, BRL, { bold: true, color: GREEN });
}
// Linha TOTAL
const TR = VE_L + 1;
for (let c = 1; c <= 5; c++) ws.getCell(TR, c).fill = fill(HEADER);
const tl = ws.getCell(TR, 2); tl.value = "TOTAL"; tl.font = { name: FONT, bold: true, color: { argb: HEADER_TXT } }; tl.alignment = { horizontal: "right" };
for (const c of [6, 7, 8]) {
  const L = ws.getColumn(c).letter;
  const cell = ws.getCell(TR, c); cell.value = { formula: `SUM(${L}${VE_F}:${L}${VE_L})` };
  cell.numFmt = BRL; cell.font = { name: FONT, bold: true, color: { argb: HEADER_TXT } }; cell.fill = fill(HEADER);
  cell.alignment = { horizontal: "center" }; cell.border = border;
}

// ═══════════════ ABA 5: RESUMO FINANCEIRO ═══════════════
ws = wb.addWorksheet("Resumo Financeiro", { views: [{ showGridLines: false }] });
ws.getColumn(1).width = 2; ws.getColumn(2).width = 30; ws.getColumn(3).width = 22;
ws.getColumn(5).width = 22; ws.getColumn(6).width = 16;
ws.getCell("B2").value = "RESUMO FINANCEIRO";
ws.getCell("B2").font = { name: FONT, bold: true, size: 16, color: { argb: GREEN } };
ws.getCell("B3").value = "Atualiza sozinho conforme você lança as vendas.";
ws.getCell("B3").font = { name: FONT, italic: true, size: 10, color: { argb: GREY } };

const V = "'Controle de Vendas'";
// Tabela de apoio — plataformas (E/F)
const plats = ["Shopee", "Mercado Livre", "WhatsApp", "Instagram"];
ws.getCell("E5").value = "Apoio: plataformas (não apague)";
ws.getCell("E5").font = { name: FONT, bold: true, size: 9, color: { argb: GREY } };
ws.mergeCells("E5:F5");
plats.forEach((p, idx) => {
  const row = 6 + idx;
  const pc = ws.getCell(row, 5); pc.value = p; pc.font = { name: FONT, size: 10 }; pc.border = border;
  const rc = ws.getCell(row, 6); rc.value = { formula: `SUMIF(${V}!$C$3:$C$202,E${row},${V}!$F$3:$F$202)` };
  rc.numFmt = BRL; rc.font = { name: FONT, size: 10 }; rc.border = border;
});
// Tabela de apoio — produtos (E/F a partir da linha 12), puxa lista da Precificação
ws.getCell("E11").value = "Apoio: produtos (não apague)";
ws.getCell("E11").font = { name: FONT, bold: true, size: 9, color: { argb: GREY } };
ws.mergeCells("E11:F11");
const APF = 12, APL = 61;
for (let i = APF; i <= APL; i++) {
  const prRow = PR_F + (i - APF); // 3..52
  const pc = ws.getCell(i, 5); pc.value = { formula: `IF(${PRf}!A${prRow}="","",${PRf}!A${prRow})` }; pc.font = { name: FONT, size: 9 };
  const qc = ws.getCell(i, 6); qc.value = { formula: `IF(${PRf}!A${prRow}="","",SUMIF(${V}!$B$3:$B$202,${PRf}!A${prRow},${V}!$D$3:$D$202))` }; qc.font = { name: FONT, size: 9 };
}

// Cards principais
const cards = [
  ["Receita total do mês", `SUM(${V}!F3:F202)`, BRL, true],
  ["Custo total", `SUM(${V}!G3:G202)`, BRL, false],
  ["Lucro bruto", `SUM(${V}!H3:H202)`, BRL, true],
  ["Produto mais vendido", `IFERROR(IF(MAX(F${APF}:F${APL})=0,"—",INDEX(E${APF}:E${APL},MATCH(MAX(F${APF}:F${APL}),F${APF}:F${APL},0))),"—")`, null, false],
  ["Plataforma que mais vendeu", `IFERROR(IF(MAX(F6:F9)=0,"—",INDEX(E6:E9,MATCH(MAX(F6:F9),F6:F9,0))),"—")`, null, false],
];
r = 5;
for (const [label, formula, fmt, hot] of cards) {
  const lc = ws.getCell(r, 2); lc.value = label; lc.font = { name: FONT, bold: true, size: 11, color: { argb: DARK } };
  lc.fill = fill("FFF0FDF4"); lc.alignment = { horizontal: "left", vertical: "middle", indent: 1 }; lc.border = border;
  const vc = ws.getCell(r, 3); vc.value = { formula };
  if (fmt) vc.numFmt = fmt;
  vc.fill = fill(CALC);
  vc.font = { name: FONT, bold: true, size: 12, color: { argb: hot ? GREEN : DARK } };
  vc.alignment = { horizontal: "center", vertical: "middle" }; vc.border = border;
  ws.getRow(r).height = 28; r++;
}
ws.getCell(r + 1, 2).value = "FornecedorVip — fornecedorvip.shop";
ws.getCell(r + 1, 2).font = { name: FONT, italic: true, size: 9, color: { argb: GREY } };

fs.mkdirSync("order-bumps", { recursive: true });
const out = "order-bumps/Planilha-Controle-e-Precificacao.xlsx";
wb.xlsx.writeFile(out).then(() => console.log("salvo:", out));
