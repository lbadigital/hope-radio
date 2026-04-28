import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import RadioPlayer from "@/components/player/RadioPlayer";

const archivo = Archivo({ subsets: ["latin"], weight: ["600"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Hope Radio",
  description: "Hope Radio — La radio en ligne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased ${archivo.variable}`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <RadioPlayer />
      </body>
    </html>
  );
}
