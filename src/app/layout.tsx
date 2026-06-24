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
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1274073178133799');fbq('track','PageView');` }} />
        <noscript><img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1274073178133799&ev=PageView&noscript=1" alt="" /></noscript>
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
