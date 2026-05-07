import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
/* import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";*/
import Header from "@/components/layout/Header";
import RadioPlayer from "@/components/player/RadioPlayer";

const archivo = Archivo({ subsets: ["latin"], weight: ["600"], variable: "--font-archivo" });

const streamOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_STREAM_URL ?? 'https://stream.hoperadio.fr/hoperadio').origin;
  } catch {
    return 'https://stream.hoperadio.fr';
  }
})();

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
      <head>
        <link rel="preconnect" href={streamOrigin} />
        <link rel="dns-prefetch" href={streamOrigin} />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <RadioPlayer />
      </body>
    </html>
  );
}
