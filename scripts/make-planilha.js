const ExcelJS = require("exceljs");
const fs = require("fs");

const ORANGE = "FFEA580C", ORANGE_LT = "FFFFF7ED", GREEN = "FF16A34A", GREY = "FF6B7280";
const INPUT = "FFFEF3C7", WHITE = "FFFFFFFF", DARK = "FF111111", BLUE = "FF1D4ED8", GREEN_LT = "FFF0FDF4";
const FONT = "Calibri";
const BRL = '"R$" #,##0.00';
const PCT = "0.0%";

const thin = { style: "thin", color: { argb: "FFE5E7EB" } };
const border = { top: thin, left: thin, right: thin, bottom: thin };

const wb = new ExcelJS.Workbook();

function fill(argb) { return { type: "pattern", pattern: "solid", fgColor: { argb } }; }

// ───────── ABA 1: INÍCIO
let ws = wb.addWorksheet("Início", { views: [{ showGridLines: false }] });
ws.getColumn(1).width = 2; ws.getColumn(2).width = 95;
ws.getCell("B2").value = "FORNECEDORVIP";
ws.getCell("B2").font = { name: FONT, bold: true, size: 20, color: { argb: ORANGE } };
ws.getCell("B3").value = "Planilha de Controle + Precificação";
ws.getCell("B3").font = { name: FONT, bold: true, size: 14, color: { argb: DARK } };
ws.getCell("B4").value = "Sua revenda organizada e lucrativa, sem precisar entender de planilha.";
ws.getCell("B4").font = { name: FONT, size: 11, color: { argb: GREY }, italic: true };

const guide = [
  ["", ""],
  ["COMO USAR (leva 2 minutos):", "h"],
  ["As células em amarelo são as únicas que você preenche. O resto a planilha calcula sozinha.", "t"],
  ["", ""],
  ["1)  Aba PRECIFICAÇÃO", "b"],
  ["Coloque o custo do produto, o frete e a taxa do marketplace. A planilha te diz o preço de venda ideal e o lucro de cada produto. Nunca mais venda no prejuízo.", "t"],
  ["", ""],
  ["2)  Aba CONTROLE DE VENDAS", "b"],
  ["Anote cada venda. A planilha calcula faturamento, taxas e lucro automaticamente.", "t"],
  ["", ""],
  ["3)  Aba CONTROLE DE ESTOQUE", "b"],
  ["Acompanhe quanto você tem de cada produto. Ela avisa quando é hora de repor.", "t"],
  ["", ""],
  ["4)  Aba RESUMO", "b"],
  ["Seu painel: faturamento total, lucro, ticket médio e margem. Tudo num lugar só.", "t"],
  ["", ""],
  ["DICA: comece pela aba Precificação para nunca errar o preço. É lá que está o lucro.", "tip"],
];
let r = 6;
for (const [text, kind] of guide) {
  const cell = ws.getCell(`B${r}`);
  cell.value = text;
  if (kind === "h") cell.font = { name: FONT, bold: true, size: 13, color: { argb: ORANGE } };
  else if (kind === "b") cell.font = { name: FONT, bold: true, size: 12, color: { argb: DARK } };
  else if (kind === "t") { cell.font = { name: FONT, size: 11, color: { argb: "FF333333" } }; cell.alignment = { wrapText: true, vertical: "top" }; ws.getRow(r).height = 30; }
  else if (kind === "tip") { cell.font = { name: FONT, bold: true, size: 11, color: { argb: GREEN } }; cell.fill = fill(GREEN_LT); cell.alignment = { wrapText: true, vertical: "middle" }; cell.border = border; ws.getRow(r).height = 28; }
  r++;
}

function headerCell(cell, text) {
  cell.value = text;
  cell.font = { name: FONT, bold: true, color: { argb: WHITE }, size: 11 };
  cell.fill = fill(ORANGE);
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  cell.border = border;
}

// ───────── ABA 2: PRECIFICAÇÃO
ws = wb.addWorksheet("Precificação", { views: [{ showGridLines: false }] });
const pH = ["Produto", "Custo do\nproduto (R$)", "Frete +\nembalagem (R$)", "Taxa do\nmarketplace (%)", "Margem de\nlucro desejada (%)", "Custo\ntotal (R$)", "PREÇO DE VENDA\nideal (R$)", "Lucro por\nvenda (R$)", "Margem\nreal (%)"];
[26, 13, 14, 14, 16, 12, 17, 13, 11].forEach((w, i) => ws.getColumn(i + 1).width = w);
ws.mergeCells("A1:I1");
ws.getCell("A1").value = "PRECIFICAÇÃO INTELIGENTE — preencha as colunas amarelas e veja o preço ideal";
ws.getCell("A1").font = { name: FONT, bold: true, size: 12, color: { argb: ORANGE } };
pH.forEach((h, i) => headerCell(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 38;

const examples = [
  ["Conjunto fitness", 22, 8, 0.20, 0.30],
  ["Perfume importado 50ml", 35, 6, 0.16, 0.35],
  ["Kit maquiagem", 28, 7, 0.20, 0.30],
];
const PF = 3, PL = 52;
for (let i = PF; i <= PL; i++) {
  const ex = examples[i - PF];
  const cA = ws.getCell(i, 1); cA.value = ex ? ex[0] : null; cA.font = { name: FONT, size: 11 }; cA.border = border;
  const inputs = [[2, ex ? ex[1] : null, BRL], [3, ex ? ex[2] : null, BRL], [4, ex ? ex[3] : null, PCT], [5, ex ? ex[4] : null, PCT]];
  for (const [col, val, fmt] of inputs) {
    const c = ws.getCell(i, col);
    c.value = val; c.fill = fill(INPUT); c.font = { name: FONT, color: { argb: BLUE }, size: 11 };
    c.numFmt = fmt; c.alignment = { horizontal: "center" }; c.border = border;
  }
  const f = ws.getCell(i, 6); f.value = { formula: `IF(B${i}="","",B${i}+C${i})` }; f.numFmt = BRL; f.alignment = { horizontal: "center" }; f.border = border; f.font = { name: FONT, size: 11 };
  const g = ws.getCell(i, 7); g.value = { formula: `IFERROR(IF(F${i}="","",F${i}/(1-D${i}-E${i})),"rever %")` }; g.numFmt = BRL; g.alignment = { horizontal: "center" }; g.border = border; g.font = { name: FONT, bold: true, size: 11, color: { argb: GREEN } }; g.fill = fill(GREEN_LT);
  const h = ws.getCell(i, 8); h.value = { formula: `IFERROR(IF(G${i}="","",G${i}-F${i}-G${i}*D${i}),"")` }; h.numFmt = BRL; h.alignment = { horizontal: "center" }; h.border = border; h.font = { name: FONT, size: 11 };
  const ii = ws.getCell(i, 9); ii.value = { formula: `IFERROR(IF(G${i}="","",H${i}/G${i}),"")` }; ii.numFmt = PCT; ii.alignment = { horizontal: "center" }; ii.border = border; ii.font = { name: FONT, size: 11 };
}
ws.mergeCells(`A${PL + 2}:I${PL + 2}`);
ws.getCell(`A${PL + 2}`).value = "Taxas comuns: Shopee ~20%  |  Mercado Livre ~16%  |  Venda no Instagram/WhatsApp = 0%";
ws.getCell(`A${PL + 2}`).font = { name: FONT, italic: true, size: 10, color: { argb: GREY } };

// ───────── ABA 3: CONTROLE DE VENDAS
ws = wb.addWorksheet("Controle de Vendas", { views: [{ showGridLines: false }] });
const vH = ["Data", "Produto", "Qtd", "Custo unit.\n(R$)", "Preço venda\nunit. (R$)", "Taxa\nmkt (%)", "Faturamento\n(R$)", "Custo total\n(R$)", "Taxa paga\n(R$)", "LUCRO\n(R$)"];
[12, 26, 7, 12, 13, 9, 14, 13, 12, 13].forEach((w, i) => ws.getColumn(i + 1).width = w);
ws.mergeCells("A1:J1");
ws.getCell("A1").value = "CONTROLE DE VENDAS — anote cada venda nas colunas amarelas";
ws.getCell("A1").font = { name: FONT, bold: true, size: 12, color: { argb: ORANGE } };
vH.forEach((h, i) => headerCell(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 38;
const VF = 3, VL = 202;
for (let i = VF; i <= VL; i++) {
  const ins = [[1, null], [2, null], [3, "0"], [4, BRL], [5, BRL], [6, PCT]];
  for (const [col, fmt] of ins) {
    const c = ws.getCell(i, col);
    c.fill = fill(INPUT); c.font = { name: FONT, color: { argb: BLUE }, size: 11 };
    if (fmt) c.numFmt = fmt;
    c.alignment = { horizontal: col === 2 ? "left" : "center" }; c.border = border;
  }
  const set = (col, formula, opts = {}) => {
    const c = ws.getCell(i, col); c.value = { formula }; c.numFmt = BRL;
    c.alignment = { horizontal: "center" }; c.border = border;
    c.font = opts.bold ? { name: FONT, bold: true, color: { argb: GREEN }, size: 11 } : { name: FONT, size: 11 };
  };
  set(7, `IF(C${i}="","",C${i}*E${i})`);
  set(8, `IF(C${i}="","",C${i}*D${i})`);
  set(9, `IF(C${i}="","",G${i}*F${i})`);
  set(10, `IF(C${i}="","",G${i}-H${i}-I${i})`, { bold: true });
}
const tr = VL + 1;
for (let col = 1; col <= 6; col++) ws.getCell(tr, col).fill = fill(ORANGE);
const tlabel = ws.getCell(tr, 2); tlabel.value = "TOTAL"; tlabel.font = { name: FONT, bold: true, color: { argb: WHITE } }; tlabel.alignment = { horizontal: "right" };
for (const col of [7, 8, 9, 10]) {
  const L = ws.getColumn(col).letter;
  const c = ws.getCell(tr, col); c.value = { formula: `SUM(${L}${VF}:${L}${VL})` };
  c.numFmt = BRL; c.font = { name: FONT, bold: true, color: { argb: WHITE } }; c.fill = fill(ORANGE);
  c.alignment = { horizontal: "center" }; c.border = border;
}

// ───────── ABA 4: CONTROLE DE ESTOQUE
ws = wb.addWorksheet("Controle de Estoque", { views: [{ showGridLines: false }] });
const eH = ["Produto", "Estoque\ninicial", "Entradas\n(comprou)", "Saídas\n(vendeu)", "Estoque\natual", "Estoque\nmínimo", "Situação"];
[30, 11, 12, 11, 11, 11, 16].forEach((w, i) => ws.getColumn(i + 1).width = w);
ws.mergeCells("A1:G1");
ws.getCell("A1").value = "CONTROLE DE ESTOQUE — preencha o amarelo, a planilha avisa quando repor";
ws.getCell("A1").font = { name: FONT, bold: true, size: 12, color: { argb: ORANGE } };
eH.forEach((h, i) => headerCell(ws.getCell(2, i + 1), h));
ws.getRow(2).height = 32;
const EF = 3, EL = 52;
for (let i = EF; i <= EL; i++) {
  for (const col of [1, 2, 3, 4, 6]) {
    const c = ws.getCell(i, col);
    c.fill = fill(INPUT); c.font = { name: FONT, color: { argb: BLUE }, size: 11 };
    if (col !== 1) c.numFmt = "0";
    c.alignment = { horizontal: col === 1 ? "left" : "center" }; c.border = border;
  }
  const e = ws.getCell(i, 5); e.value = { formula: `IF(A${i}="","",B${i}+C${i}-D${i})` }; e.numFmt = "0"; e.alignment = { horizontal: "center" }; e.border = border; e.font = { name: FONT, bold: true, size: 11 };
  const g = ws.getCell(i, 7); g.value = { formula: `IF(A${i}="","",IF(E${i}<=F${i},"⚠ REPOR","OK"))` }; g.alignment = { horizontal: "center" }; g.border = border; g.font = { name: FONT, bold: true, size: 11 };
}

// ───────── ABA 5: RESUMO
ws = wb.addWorksheet("Resumo", { views: [{ showGridLines: false }] });
ws.getColumn(1).width = 2; ws.getColumn(2).width = 34; ws.getColumn(3).width = 22;
ws.getCell("B2").value = "RESUMO DO SEU NEGÓCIO";
ws.getCell("B2").font = { name: FONT, bold: true, size: 16, color: { argb: ORANGE } };
ws.getCell("B3").value = "Atualiza sozinho conforme você lança as vendas.";
ws.getCell("B3").font = { name: FONT, italic: true, size: 10, color: { argb: GREY } };
const V = "'Controle de Vendas'";
const cards = [
  ["Faturamento total", `SUM(${V}!G3:G202)`, BRL],
  ["Lucro total", `SUM(${V}!J3:J202)`, BRL],
  ["Total de produtos vendidos", `SUM(${V}!C3:C202)`, "0"],
  ["Número de vendas (pedidos)", `COUNT(${V}!E3:E202)`, "0"],
  ["Ticket médio", `IFERROR(SUM(${V}!G3:G202)/COUNT(${V}!E3:E202),0)`, BRL],
  ["Margem de lucro média", `IFERROR(SUM(${V}!J3:J202)/SUM(${V}!G3:G202),0)`, PCT],
  ["Total pago em taxas", `SUM(${V}!I3:I202)`, BRL],
];
r = 5;
for (const [title, formula, fmt] of cards) {
  const lc = ws.getCell(r, 2); lc.value = title; lc.font = { name: FONT, bold: true, size: 11, color: { argb: DARK } };
  lc.fill = fill(ORANGE_LT); lc.alignment = { horizontal: "left", vertical: "middle", indent: 1 }; lc.border = border;
  const vc = ws.getCell(r, 3); vc.value = { formula }; vc.numFmt = fmt;
  const hot = title === "Lucro total" || title === "Faturamento total";
  vc.font = { name: FONT, bold: true, size: 12, color: { argb: hot ? GREEN : DARK } };
  vc.alignment = { horizontal: "center", vertical: "middle" }; vc.border = border;
  ws.getRow(r).height = 26; r++;
}
ws.getCell(r + 1, 2).value = "FornecedorVip — fornecedorvip.shop";
ws.getCell(r + 1, 2).font = { name: FONT, italic: true, size: 9, color: { argb: GREY } };

fs.mkdirSync("order-bumps", { recursive: true });
const out = "order-bumps/Planilha-Controle-e-Precificacao.xlsx";
wb.xlsx.writeFile(out).then(() => console.log("salvo:", out));
