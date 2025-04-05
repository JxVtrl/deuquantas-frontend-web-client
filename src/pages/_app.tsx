import { AuthProvider } from '@/contexts/AuthContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CustomerProvider>
        <UserPreferencesProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </UserPreferencesProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}
