// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/wrappers/Header";
import Footer from "./components/wrappers/Footer";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elan Blog | Insights on Road Tests and Driving in Ontario",
  description: "Expert tips, guides, and stories about G2 and Full G road tests, driving skills, and navigating Ontario's licensing system.",
  keywords: ["driving blog", "road test tips", "G2 preparation", "G test advice", "Ontario driving", "driver education", "learner resources"],
  openGraph: {
    title: "Elan Blog | Ontario Road Test and Driving Resources",
    description: "Read the latest articles, guides, and success stories about road tests and driving in Ontario.",
    url: "https://elanroadtestrental.ca/",
    siteName: "Elan Road Test Blog",
    images: [
      {
        url: "/elan-og-image.png",
        width: 1200,
        height: 630,
        alt: "Elan Road Test Blog",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elan Blog | Ontario Road Test Resources",
    description: "Expert articles and guides on mastering your G2 or G road test in Ontario.",
    images: ["/elan-og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://blog.elanroadtestrental.ca/",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#009D6C",
  verification: {
    google: ["mOBvh3tt9kHEuSkqHL3c4t2X31zJQDGeRn7tCRZ7vTc", "mqvF7eCq5Eh5AIwiYZ2T26dO83i1XyIvn7x_SSoavbA"],
    other: {
      "msvalidate.01": "33D263AD066DC0AC93AE53D66D266BB4",
    },
  },
  category: "blog",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics/>
      <Head>
        <meta name="google-site-verification" content="mOBvh3tt9kHEuSkqHL3c4t2X31zJQDGeRn7tCRZ7vTc" />
        <meta name="google-site-verification" content="mqvF7eCq5Eh5AIwiYZ2T26dO83i1XyIvn7x_SSoavbA" />
        <meta name="msvalidate.01" content="33D263AD066DC0AC93AE53D66D266BB4" />
      </Head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-PHB1P5NKQM"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PHB1P5NKQM');
            `,
          }}
        />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}