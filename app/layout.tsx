import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { SonnerToaster } from "@/components/ui/sonner-toaster";

export const metadata: Metadata = {
  title: "Serxus",
  description: "SaaS base — Next.js + auth-service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}
