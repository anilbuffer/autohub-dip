import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"], 
  variable: '--font-roboto',
  display: 'swap',
  weight: ['300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: "AutoHub Dealer Intelligence Platform (DIP)",
  description: "Next-generation automotive dealer intelligence, Japanese vehicle auction sourcing, landed cost calculation, and margin arbitrage platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.variable} font-sans antialiased bg-slate-50 text-slate-900 h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
