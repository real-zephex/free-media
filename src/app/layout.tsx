import "./globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";

import Navbar from "@/components/ui/navbar";
import { font_inter, font_outfit } from "@/components/fonts";
import Script from "next/script";

const APP_NAME = "Dramaflix";
const APP_DEFAULT_TITLE = "Dramaflix";
const APP_TITLE_TEMPLATE = "%s - Dramaflix";
const APP_DESCRIPTION = "Your one stop solution for all your media needs.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: "https://free-media.netlify.app/logo.png",
        width: 1920,
        height: 1080,
        alt: `${APP_NAME} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ["https://free-media.netlify.app/logo.png"],
  },
  keywords: [
    "streaming",
    "movies",
    "TV shows",
    "media",
    "netflix",
    "prime",
    "amazon prime",
    "hotstar",
    "HBO",
    "fmyh",
    "free-media"
  ],
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <GoogleAnalytics gaId="G-64S37Q7YY4" />
        {/* <Script
          type="text/javascript"
          src="//pl25806056.effectiveratecpm.com/07/e6/31/07e6311772411d8ec4ded0982962182c.js"
        /> */}
      </head>
      <body className={`${font_inter.variable} ${font_outfit.variable} font-sans antialiased`}>
        <NextTopLoader showSpinner={false} />
        <Navbar />
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
      </body>
    </html>
  );
}
