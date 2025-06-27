"use client";
import { Geist, Geist_Mono, Limelight, Alumni_Sans_Pinstripe } from "next/font/google";
import "./globals.css";
// import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
   weight: ["400", "700"],
});

const alumniSansPinstripe = Alumni_Sans_Pinstripe({
  variable: '--font-alumni-sans-pinstripe',
    weight: '400', // Use the default weight or adjust as needed
    subsets: ['latin'], // Choose relevant subsets
});

const limelight = Limelight({
    variable: '--font-limelight',
  subsets: ["latin"],
   weight: ["400"],
});

export const metadata = {
  title: "Urban Canvas - A Creative Space for Urban Art and Design",
  description: "Urban Canvas is a platform to discover, share, and celebrate street art and murals from around the world. Join our creative community and map your favorite urban art!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"
   
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${alumniSansPinstripe.variable} ${limelight.variable} bg-white text-black dark:bg-black dark:text-white weight-400`}   
      >
      {children}
      </body>
    </html>
  );
}
