import { AuthProvider } from '@/contexts/AuthContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { ComandaProvider } from '@/contexts/ComandaContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import 'modern-normalize/modern-normalize.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);
  return (
    <AuthProvider>
      <CustomerProvider>
        <UserPreferencesProvider>
          <ComandaProvider>
            <main className={inter.className}>
              <Component {...pageProps} />
            </main>
          </ComandaProvider>
        </UserPreferencesProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}
