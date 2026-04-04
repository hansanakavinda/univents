import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/ui/Toast";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO: metadataBase enables proper resolution of relative OG image URLs
// and is required for sitemap/robots generation with absolute URLs.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "https://univents.com.lk"
  ),
  title: {
    default: "Univents",
    template: "%s | Univents",
  },
  description:
    "Discover and share events happening across university campuses in Sri Lanka. Browse upcoming events, connect with communities, and never miss what matters.",
  openGraph: {
    siteName: "Univents",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>

      </body>
    </html>
  );
}
