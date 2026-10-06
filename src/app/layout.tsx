import type { Metadata } from "next";
import {
  Cal_Sans,
  Geist,
  Geist_Mono,
  Outfit,
  Playfair,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const calSans = Cal_Sans({
  variable: "--font-cal-sans",
  subsets: ["latin"],
  weight: ["400"],
});
const playFair = Playfair({
  variable: "--font-play-fair",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Healthcare Website Design That Wins Patient Trust | TAIBA",
  description: "HIPAA-aware, SEO-ready healthcare websites for clinics, dentists & therapists. Online booking, local SEO & mobile-first design that brings in new patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${calSans.variable} ${playFair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
