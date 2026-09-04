import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TelegramBoot } from "@/components/TelegramBoot";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "BODY RESET",
  description: "56 дней, чтобы выстроить питание, движение и привычки без экстремальных диет.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TelegramBoot />
        <div className="mx-auto min-h-dvh max-w-md bg-bg">{children}</div>
      </body>
    </html>
  );
}
