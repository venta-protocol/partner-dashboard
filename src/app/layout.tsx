import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Setup Metadata
export const metadata: Metadata = {
  title: "Venta POS",
  description: "Venta POS",
};

// RootLayout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster closeButton position="top-center" />
        {children}
      </body>
    </html>
  );
}
