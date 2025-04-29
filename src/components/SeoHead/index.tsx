import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SeoHead({
  title,
  description = 'Comanda transparente em tempo real para bares e restaurantes.',
  image = '/images/og-image.png',
  url = 'https://deuquantas.com.br',
}: SeoHeadProps) {
  const router = useRouter();

  // Se não passar title manualmente, gera baseado no pathname
  const defaultTitle = generateTitleFromPath(router.pathname);

  const finalTitle = title || defaultTitle;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${url}${router.asPath}`} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${url}${router.asPath}`} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

function generateTitleFromPath(pathname: string): string {
  if (pathname === '/') {
    return 'DeuQuantas - Sua Comanda Sem Surpresas';
  }

  const cleanPath = pathname.replace('/', '').replace('-', ' ');
  const capitalized = cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);

  return `${capitalized} - DeuQuantas`;
}
