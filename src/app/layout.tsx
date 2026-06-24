import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FornecedorVip | 180 Fornecedores Direto do Atacado",
  description:
    "Acesse a lista com 180 fornecedores direto da fonte, testados e aprovados. Comece a revender com menos de R$100, sem CNPJ e sem pedido mínimo.",
  openGraph: {
    title: "FornecedorVip | 180 Fornecedores Direto do Atacado",
    description:
      "Acesse a lista com 180 fornecedores direto da fonte, testados e aprovados.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='85'>🏪</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', -apple-system, sans-serif; background: #fff; color: #111; }
          button { font-family: inherit; }
          input { font-family: inherit; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
