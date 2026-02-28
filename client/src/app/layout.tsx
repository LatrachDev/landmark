import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ConditionalFooter from '@/components/footer/ConditionalFooter';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/LayoutWrapper';
import NavigationProgress from '@/components/NavigationProgress';
import SmoothMouseFollower from '@/components/SmoothMouseFollower';

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

const jenine = localFont({
  src: "../assets/fonts/alfont_com_Jenine-Bold.otf",
  variable: "--font-jenine",
  weight: "700",
});

const madaniRegular = localFont({
  src: "../assets/fonts/alfont_com_Madani-Arabic-Regular.ttf",
  variable: "--font-madani-regular",
  weight: "400",
});

const madaniBold = localFont({
  src: "../assets/fonts/alfont_com_Madani-Arabic-Bold.ttf",
  variable: "--font-madani-bold",
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://landmark.ma'),
  title: {
    default: "Landmark - Agence Marketing Digital au Maroc | Branding & Stratégie Créative",
    template: "%s | Landmark Agency"
  },
  description: "Renforcez votre présence en ligne, créez une identité de marque forte et captivez votre audience avec Landmark - agence de marketing digital au Maroc spécialisée en branding, création de contenu et développement web.",
  keywords: [
    "agence marketing digital maroc",
    "branding maroc",
    "création contenu maroc",
    "développement web oujda",
    "marketing digital casablanca",
    "agence créative tanger",
    "stratégie digitale maroc",
    "Landmark agency",
    "Haytham Guemmah",
    "photographie commerciale maroc",
    "montage vidéo maroc",
    "impression maroc",
    "design graphique maroc",
    "agence web maroc"
  ],
  authors: [{ name: "Landmark Agency - Haytham Guemmah" }],
  creator: "Landmark Agency",
  publisher: "Landmark Marketing Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://landmark.ma',
    siteName: 'Landmark Agency',
    title: 'Landmark - Agence Marketing Digital au Maroc | Branding & Stratégie Créative',
    description: 'Renforcez votre présence en ligne, créez une identité de marque forte et captivez votre audience avec Landmark - top agence de marketing digital au Maroc',
    images: [
      {
        url: '/assets/Logotype/White.png',
        width: 1200,
        height: 630,
        alt: 'Landmark Agency Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LandmarkAgency',
    creator: '@LandmarkAgency',
    title: 'Landmark - Agence Marketing Digital au Maroc',
    description: 'Agence créative spécialisée en branding, marketing digital et stratégie de contenu au Maroc.',
    images: ['/assets/Logotype/White.png'],
  },
  alternates: {
    canonical: 'https://landmark.ma',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'MA',
    'geo.position': '34.6814;-1.9086',
    'geo.placename': 'Oujda, Morocco',
    'language': 'French',
    'company': 'Landmark Marketing Agency',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#010e26' },
    { media: '(prefers-color-scheme: dark)', color: '#010e26' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Landmark Agency",
    "alternateName": "Landmark Marketing Agency",
    "url": "https://landmark.ma",
    "logo": "https://landmark.ma/assets/Logotype/White.png",
    "description": "Agence marketing digital au Maroc spécialisée en branding, création de contenu, développement web et stratégie digitale.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Oujda",
      "addressRegion": "Oriental",
      "postalCode": "60000",
      "addressCountry": "MA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-710-220010",
      "contactType": "customer service",
      "availableLanguage": ["French", "Arabic", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/Landmarkagency",
      "https://www.instagram.com/Landmarkagency",
      "https://www.linkedin.com/company/Landmarkagency"
    ],
    "founder": {
      "@type": "Person",
      "name": "Haytham Guemmah"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Oujda"
      },
      {
        "@type": "City",
        "name": "Casablanca"
      },
      {
        "@type": "City",
        "name": "Tanger"
      },
      {
        "@type": "Country",
        "name": "Morocco"
      }
    ],
    "serviceType": [
      "Digital Marketing",
      "Branding",
      "Web Development",
      "Content Creation",
      "Photography",
      "Video Production",
      "Graphic Design"
    ]
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoni.variable} ${dmSans.variable} ${jost.variable} ${jenine.variable} ${madaniRegular.variable} ${madaniBold.variable} antialiased overflow-x-hidden`}
      >
        <SmoothMouseFollower />
        <NavigationProgress />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <ConditionalFooter />

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
