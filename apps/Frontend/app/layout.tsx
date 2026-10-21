import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "ColabCanvas – Shared whiteboard",
    template: "%s | ColabCanvas"
  },
  description: "ColabCanvas is a shared whiteboard that runs in the browser. Draw in a room and others see each finished stroke.",
  keywords: [
    "collaborative whiteboard",
    "shared canvas",
    "online whiteboard",
    "ColabCanvas"
  ],
  authors: [{ name: "ColabCanvas Team", url: "https://github.com/ParthKadam11/ColabCanvas" }],
  creator: "ColabCanvas Team",
  openGraph: {
    title: "ColabCanvas – Shared whiteboard",
    description: "A shared whiteboard in the browser. Others see each finished stroke.",
    url: "https://colabcanvas.com/",
    siteName: "ColabCanvas",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ColabCanvas – Shared whiteboard"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ColabCanvas – Shared whiteboard",
    description: "A shared whiteboard in the browser. Others see each finished stroke.",
    images: ["/og-image.png"],
    creator: "@ColabCanvas"
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="google-site-verification" content="wK6o9NHbyALWjDTaXEkDSRHeyUP3gWFuGqioGXtCZ-w" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
