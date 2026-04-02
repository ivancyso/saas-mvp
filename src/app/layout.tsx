import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IdeaFlow - Startup Ideas Backed by Real Research",
    template: "%s | IdeaFlow",
  },
  description:
    "Deeply researched startup opportunities published weekly. Market analysis, competitive landscape, and execution playbooks for builders.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "IdeaFlow",
    title: "IdeaFlow - Startup Ideas Backed by Real Research",
    description:
      "Deeply researched startup opportunities published weekly. Market analysis, competitive landscape, and execution playbooks for builders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaFlow - Startup Ideas Backed by Real Research",
    description:
      "Deeply researched startup opportunities published weekly.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "IdeaFlow" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <ClerkProvider>{children}</ClerkProvider>
        ) : (
          children
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
