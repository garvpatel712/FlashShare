import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "FlashShare - Secure Temporary Code & Note Sharing Platform",
  description: "Share code, notes, and screenshots without login. Perfect for students in computer labs - no account needed, 24-hour storage, markdown support, and instant sharing. Your secure solution for temporary file sharing.",
  keywords: "temporary storage, code sharing, student notes, computer lab tool, no login required, secure file sharing, markdown editor, temporary notepad, code snippets, image sharing",
  // Provide an absolute icon URL so Next doesn't try to read `app/favicon.ico` with the metadata loader
  icon: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/favicon.ico`,
  openGraph: {
    title: "FlashShare - Secure Temporary Code & Note Sharing Platform",
    description: "Share code, notes, and screenshots without login. Perfect for students in computer labs - no account needed, 24-hour storage, markdown support, and instant sharing.",
    type: "website",
    url: "https://flashshare.vercel.app",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "FlashShare - Temporary Code & Note Sharing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashShare - Secure Temporary Code & Note Sharing Platform",
    description: "Share code, notes, and screenshots without login. Perfect for students in computer labs - no account needed, 24-hour storage, markdown support, and instant sharing.",
    images: ["/og-image.jpg"], // Same image as OpenGraph
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#09090b" />
        <meta name="google-site-verification" content="MCCP3vhLhrI2FN53psNET5d6gZjkohu7RZmY7fzB3h0" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content="FlashShare" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="FlashShare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://flashshare.vercel.app" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#09090b] text-[#fafafa]`}>
        <div className="h-[100dvh] flex flex-col">
          <Navbar />
          <div className="flex-1 h-full w-full">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
