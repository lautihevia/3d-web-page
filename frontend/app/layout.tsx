import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3dENCASA · Impresión 3D Profesional",
  description:
    "Las mejores impresoras 3D, filamentos y electrónica curada. Precios visibles, asesoramiento técnico real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-manrope), system-ui, sans-serif",
          margin: 0,
          padding: 0,
          background: "#fff",
        }}
      >
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
