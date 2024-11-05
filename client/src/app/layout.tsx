import * as React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BiomeData",
  description: "Empowering Biomedical Research Through Unified Data Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        <NextUIProvider className="light">
          {children}
          <SpeedInsights />
        </NextUIProvider>
      </body>
    </html>
  );
}
