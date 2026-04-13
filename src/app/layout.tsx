import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ChatProvider } from "@/components/chat/ChatProvider";
import ChatPanel from "@/components/chat/ChatPanel";
import ChatToggle from "@/components/chat/ChatToggle";
import SessionProvider from "@/components/auth/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Engineer Portfolio",
  description: "Data Engineering portfolio and study blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ChatProvider>
            <Header />
            <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">
              {children}
            </main>
            <ChatToggle />
            <ChatPanel />
          </ChatProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
