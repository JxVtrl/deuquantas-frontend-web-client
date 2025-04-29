import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='pt-br'>
      <Head>
        {/* Descrição geral (máximo 160 caracteres) */}
        <meta name="description" content="Acompanhe sua comanda em tempo real, pague facilmente e tenha mais transparência no seu atendimento com o DeuQuantas." />

        {/* Viewport (responsividade) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Charset */}
        <meta charSet="UTF-8" />

        {/* Safari e iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deuquantas.com.br/" />
        <meta property="og:title" content="DeuQuantas - Sua Comanda Sem Surpresas" />
        <meta property="og:description" content="Comanda transparente em bares e restaurantes. Saiba exatamente o que pediu e quanto vai pagar. Mais confiança e agilidade!" />
        <meta property="og:image" content="https://deuquantas.com.br/images/og-image.png" /> {/* Imagem para redes sociais */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://deuquantas.com.br/" />
        <meta name="twitter:title" content="DeuQuantas - Sua Comanda Sem Surpresas" />
        <meta name="twitter:description" content="Comanda transparente em bares e restaurantes. Saiba exatamente o que pediu e quanto vai pagar." />
        <meta name="twitter:image" content="https://deuquantas.com.br/images/twitter-card.png" />

        {/* Extra SEO (opcional, ajuda bastante) */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="DeuQuantas Team" />
        <meta name="theme-color" content="#ffcc00" />
      </Head>
      <body className={'antialiased'}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
