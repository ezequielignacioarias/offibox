// src/app/layout.tsx (Raíz definitiva)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PreventBackCache from '@/components/auth/PreventBackCache';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Offibox | Oficina digital para empresas",
  description:
    "Offibox centraliza documentos, equipos, procesos y reportes para que tu empresa opere con más orden y control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <PreventBackCache />
        {children}
      </body>
    </html>
  );
}