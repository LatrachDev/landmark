import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import { Toaster } from 'react-hot-toast';

import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoni = localFont({
  src: [
    {
      path: "../assets/fonts/Bodoni/bod_r.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Bodoni/bod_b.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bodoni",
});

const dmSans = localFont({
  src: "../assets/fonts/DM/DMSans-VariableFont_opsz,wght.ttf",
  variable: "--font-dm-sans",
});

const jost = localFont({
  src: [
    {
      path: "../assets/fonts/Jost/Jost-400-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Jost/Jost-500-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Jost/Jost-600-Semi.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Jost/Jost-700-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Jost/Jost-900-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Landmark Agency - Digital Marketing",
  description: "Agence Marketing Digital & Design Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoni.variable} ${dmSans.variable} ${jost.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <Footer />

        {/* Fixed Contact Button - Mobile Only */}
        <Link
          href="/contact"
          className="fixed bottom-6 right-6 z-50 md:hidden bg-[#263973] hover:bg-[#1e2a5c] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#263973] focus:ring-offset-2"
          aria-label="Contactez-nous"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <div className="absolute inset-0 rounded-full bg-[#263973] animate-ping opacity-20"></div>
        </Link>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#010E26',
              color: '#fff',
              borderRadius: '20px',
              fontFamily: 'var(--font-jost)',
              padding: '16px 24px',
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: '900',
              letterSpacing: '0.15em',
            },
            success: {
              iconTheme: {
                primary: '#445EF2',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            }
          }}
        />
      </body>
    </html>
  );
}
