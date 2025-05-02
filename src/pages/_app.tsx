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
import { ToastContainer } from 'react-toastify';
import { initializeMercadoPago } from '@/config/mercadopago';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

// Inicializa o Mercado Pago
if (typeof window !== 'undefined') {
  initializeMercadoPago();
}

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
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ComandaProvider>
        </UserPreferencesProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}
