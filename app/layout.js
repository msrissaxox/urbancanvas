import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Urban Canvas",
  description:
    "Urban Canvas is a social media platform where street art is socially mapped. Focused solely on murals curated by local artists, users can upload and share artwork from around the world. Celebrate and explore the most inspiring murals in one place.",
  keywords: [
    "street art",
    "murals",
    "urban canvas",
    "local artists",
    "art sharing platform",
    "public art",
    "social media for artists",
    "mural map",
    "graffiti art",
    "street murals"
  ],
  openGraph: {
    title: "Urban Canvas",
    description:
      "A global social media platform for street art lovers. Discover, share, and map murals from local artists around the world.",
    url: "http://localhost:3000", // replace with your domain
    siteName: "Urban Canvas",
    images: [
      {
        url: "/urbanmural.png", // replace with a preview image URL
        width: 1200,
        height: 630,
        alt: "Urban Canvas mural preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
