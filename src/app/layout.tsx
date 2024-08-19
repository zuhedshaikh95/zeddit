import { cn } from "@/libs/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/global";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/configs/site";
import Providers from "@/libs/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  creator: "Zuhed Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: siteConfig.ogImage,
  },
  keywords: ["Zeddit", "Zuhed", "Next.js", "Tailwind CSS", "Radix UI"],
  authors: [{ name: "Zuhed Shaikh", url: "https://zuhedshaikh95.github.io" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/zeddit-favicon_192.png",
    apple: "/zeddit-favicon_512.png",
  },
};

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-slate-50 pt-12 text-slate-900 antialiased min-h-screen", inter.className)}>
        <Providers>
          <header>
            <Navbar />
          </header>

          {authModal}

          <main className="pt-12 container max-w-7xl mx-auto h-full">{children}</main>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
