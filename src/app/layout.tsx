import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

// Root layout is minimal — locale layout handles providers and metadata
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <body className={cn(inter.variable, outfit.variable, "font-sans antialiased bg-white text-gray-900 selection:bg-blue-100")}>
                {children}
            </body>
        </html>
    );
}
