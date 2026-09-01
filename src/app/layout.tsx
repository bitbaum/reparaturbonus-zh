import type { Metadata } from 'next';
import Script from 'next/script';
// Bundled fonts from the `geist` package — next/font/google fetched these at
// build time, which fails on the self-host build machine without Google access.
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SessionProviderWrapper from '@/components/providers/session-provider';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';
import { ROUTES } from '@/lib/constants/routes';
import { getPublicPage } from '@/lib/constants/page-metadata';
import { pageMetadata } from '@/lib/metadata';
// import RepairChat from "@/components/ui/AiChat";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  ...pageMetadata(ROUTES.HOME),
  metadataBase: new URL(SITE_URL),
  // Default names the home page; every segment layout supplies only its own
  // half of the title and this template appends the site name.
  title: {
    default: `${SITE_NAME} — ${getPublicPage(ROUTES.HOME).title}`,
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: [
      { url: '/logo/favicon.ico', sizes: 'any' },
      { url: '/logo/favicon_16.png', type: 'image/png', sizes: '16x16' },
      { url: '/logo/favicon_48.png', type: 'image/png', sizes: '48x48' },
    ],
    shortcut: '/logo/favicon.ico',
    apple: '/logo/favicon_48.png',
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
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </SessionProviderWrapper>

        {/* FleetCrown feedback widget — env-gated, see docs/architecture/feedback-widget.md */}
        {process.env.NEXT_PUBLIC_FC_WIDGET_TOKEN && (
          <Script
            src="https://fleetcrown.orangecat.ch/widget.js"
            strategy="afterInteractive"
            data-fc-project={process.env.NEXT_PUBLIC_FC_WIDGET_TOKEN}
          />
        )}
      </body>
    </html>
  );
}
