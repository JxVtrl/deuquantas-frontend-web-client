import Footer from "@/sections/Footer";
import Header from "@/sections/Header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-6 px-4 h-full">{children}</main>
      <Footer />
    </div>
  );
}
