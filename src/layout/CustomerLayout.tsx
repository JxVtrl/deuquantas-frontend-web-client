import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-lg font-bold">DeuQuantas</h1>
          <nav className="flex gap-4">
            <Link
              href="/customer/menu"
              className="text-indigo-600 font-medium hover:underline"
            >
              Menu
            </Link>
            <Link
              href="/customer/settings"
              className="text-indigo-600 font-medium hover:underline"
            >
              Configurações
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto py-6 px-4">{children}</main>

      {/* Rodapé */}
      <footer className="w-full bg-white shadow-md">
        <div className="container mx-auto text-center py-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} DeuQuantas. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
