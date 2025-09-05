import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Codequest AI",
  description: "Made by Yash, Hardik and Aryan",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364]`}
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
