import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoElite Motors - Carros e Motos",
  description: "Sua concessionária de confiança. Os melhores carros e motos com as melhores condições do mercado.",
  keywords: "carros, motos, concessionária, veículos, comprar carro, comprar moto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-900 text-white" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
