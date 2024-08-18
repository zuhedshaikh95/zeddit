import { cn } from "@/libs/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/global";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Providers from "@/libs/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeddit",
  description: "Post, Share, React",
  keywords: ["Zeddit", "Zuhed", "Next.js", "Tailwind CSS", "Radix UI"],
  authors: [{ name: "Zuhed Shaikh", url: "https://zuhedshaikh95.github.io" }],
  creator: "Zuhed Shaikh",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/zeddit-favicon_32.ico",
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
