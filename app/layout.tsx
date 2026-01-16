import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const signifier = localFont({
  src: "./fonts/TestSignifier-Regular.otf",
  variable: "--font-signifier",
  display: "swap",
});

const openDyslexic = localFont({
  src: "../opendyslexic-0.92/OpenDyslexic-Regular.otf",
  variable: "--font-dyslexic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude",
  description: "AI-powered chatbot with mind mapping capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${signifier.variable} ${openDyslexic.variable} antialiased font-sans`}
      >
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
