// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/wrappers/Header";
import Footer from "./components/wrappers/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elan Blog | Insights on Road Tests and Driving in Ontario",
  description: "Expert tips, guides, and stories about G2 and Full G road tests, driving skills, and navigating Ontario's licensing system.",
  keywords: ["driving blog", "road test tips", "G2 preparation", "G test advice", "Ontario driving", "driver education", "learner resources"],
  openGraph: {
    title: "Elan Blog | Ontario Road Test and Driving Resources",
    description: "Read the latest articles, guides, and success stories about road tests and driving in Ontario.",
    url: "https://elan-drivetest.ca/blog",
    siteName: "Elan DriveTest Blog",
    images: [
      {
        url: "/elan-og-image.png",
        width: 1200,
        height: 630,
        alt: "Elan DriveTest Blog",
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
    canonical: "https://blog.elandrivetestrental.ca/",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#009D6C",
  category: "blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}