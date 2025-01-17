import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Image from "next/image";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen  bg-gray-50 relative flex">
      <Image
        src="/backgrounds/gradient.svg"
        alt="background"
        layout="fill"
        quality={100}
        className="absolute z-0"
      />
      <div className="flex z-[1] flex flex-col h-full">
        <Header />
        <div className="flex-grow container mx-auto py-6 px-4 h-full">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
