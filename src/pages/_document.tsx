import { AuthProvider } from "@/contexts/AuthContext";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <AuthProvider>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </AuthProvider>
    </Html>
  );
}
