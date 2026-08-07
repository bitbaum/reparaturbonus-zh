import type { Metadata } from "next";
// Bundled fonts from the `geist` package — next/font/google fetched these at
// build time, which fails on the self-host build machine without Google access.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionProviderWrapper from "@/components/providers/session-provider";
// import RepairChat from "@/components/ui/AiChat";

const geistSans = GeistSans;
const geistMono = GeistMono;

/**
 * Where this site actually serves. Load-bearing for the social preview: Next
 * resolves the generated og:image against `metadataBase`, and without it the
 * tag is emitted as http://localhost:3000/opengraph-image — present, plausible,
 * and unfetchable by every scraper. Falls back to the real host, not localhost.
 */
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://reparaturbonus.orangecat.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Reparaturbonus Zürich - Reparieren statt wegwerfen",
  description: "Finden Sie die beste Werkstatt in Zürich und nutzen Sie CHF 100 Reparaturbonus der Stadt. Nachhaltig, günstig und umweltfreundlich.",
  openGraph: {
    title: "Reparaturbonus Zürich — Reparieren statt wegwerfen",
    description: "Die beste Werkstatt in Zürich finden und CHF 100 Reparaturbonus der Stadt nutzen.",
    url: SITE_URL,
    siteName: "Reparaturbonus Zürich",
    type: "website",
    locale: "de_CH",
  },
  icons: {
    icon: [
      { url: "/logo/favicon.ico", sizes: "any" },
      { url: "/logo/favicon_16.png", type: "image/png", sizes: "16x16" },
      { url: "/logo/favicon_48.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/logo/favicon.ico",
    apple: "/logo/favicon_48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >

        <SessionProviderWrapper>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
