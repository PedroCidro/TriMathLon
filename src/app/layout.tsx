import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "JustMathing | Plataforma de Treinamento em Cálculo",
  description: "Domine Derivadas, Integrais e EDOs com prática deliberada e interativa. Treine cálculo como um atleta treina seu esporte.",
  keywords: ["cálculo", "derivadas", "integrais", "EDO", "matemática", "treino", "prática", "universidade"],
  openGraph: {
    title: "JustMathing | Treinamento em Cálculo",
    description: "Domine Derivadas, Integrais e EDOs com prática deliberada e interativa.",
    type: "website",
    locale: "pt_BR",
    siteName: "JustMathing",
  },
  twitter: {
    card: "summary_large_image",
    title: "JustMathing | Treinamento em Cálculo",
    description: "Domine Derivadas, Integrais e EDOs com prática deliberada e interativa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased bg-white text-gray-900 selection:bg-blue-100")}>
        <ClerkProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  );
}
