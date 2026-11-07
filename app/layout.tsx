import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RII AMOR | Haute Animalier & Curated Heritage Collections",
  description:
    "Explore the Florence Collection by Rii Amor — timeless leopard prints, Italian tailored coats, python silks, and artisan essentials for the modern muse.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F4EFEA] text-[#1E1B18] selection:bg-[#C9A87C]/30 selection:text-[#1E1B18]">
        {children}
      </body>
    </html>
  );
}
