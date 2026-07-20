import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ChatWidgetWrapper } from "@/components/chat/ChatWidgetWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rentivo — AI-Powered Property Rental",
  description:
    "Find your perfect rental property with AI-powered recommendations, smart search, and seamless rental experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pb-16 lg:pb-0">
        <Providers>
          <ScrollToTop />
          <Navbar />
            <main className="flex-1 pt-20">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <BottomNav />
          <ChatWidgetWrapper />
        </Providers>
      </body>
    </html>
  );
}
