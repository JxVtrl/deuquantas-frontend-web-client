import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
