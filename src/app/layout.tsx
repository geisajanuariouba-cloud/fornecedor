import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FornecedorVip | 180 Fornecedores Direto do Atacado",
  description:
    "Acesse a lista com 180 fornecedores direto da fonte, testados e aprovados. Comece a revender com menos de R$100, sem CNPJ e sem pedido mínimo.",
  metadataBase: new URL("https://fornecedorvip.shop"),
  openGraph: {
    title: "FornecedorVip | 180 Fornecedores Direto do Atacado",
    description:
      "Acesse a lista com 180 fornecedores direto da fonte, testados e aprovados.",
    type: "website",
    url: "https://fornecedorvip.shop",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "FornecedorVip — 180 Fornecedores Direto do Atacado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FornecedorVip | 180 Fornecedores Direto do Atacado",
    description:
      "Acesse a lista com 180 fornecedores direto da fonte, testados e aprovados.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="oonp9dq8rt9bdh8cdlxz2z2l4m03fm" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='85'>🏪</text></svg>"
        />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: var(--font-inter), -apple-system, sans-serif; background: #fff; color: #111; }
          button { font-family: inherit; }
          input { font-family: inherit; }
        `}</style>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1274073178133799&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        {children}
        {/* Meta Pixel — next/script garante execução após hidratação */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1274073178133799');fbq('track','PageView');`,
          }}
        />
        {/* Utmify — captura UTMs do anúncio e repassa para o checkout da Kiwify */}
        <Script
          id="utmify-utms"
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          strategy="afterInteractive"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
        />
      </body>
    </html>
  );
}
