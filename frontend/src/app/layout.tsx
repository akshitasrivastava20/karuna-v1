
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KarunaExpandableChat } from "@/components/KarunaExpandableChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karuna - Healthcare Assistant",
  description: "AI-powered healthcare platform for medical diagnosis and assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-repeat bg-center text-gray-900`}
        style={{ 
          backgroundImage: "url('/images/Gemini_Generated_Image_71076g71076g7107.png')",
          backgroundSize: "250px 250px"
        }}
      >
        {children}
        <KarunaExpandableChat />
      </body>
    </html>
  );
}
