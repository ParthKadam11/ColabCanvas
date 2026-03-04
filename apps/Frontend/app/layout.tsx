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
    default: "ColabCanvas – Real-time Collaborative Whiteboard",
    template: "%s | ColabCanvas"
  },
  description: "ColabCanvas is a real-time collaborative whiteboard for teams, classrooms, and creators. Draw, brainstorm, and share ideas instantly.",
  keywords: [
    "collaborative whiteboard",
    "real-time drawing",
    "online canvas",
    "team brainstorming",
    "remote collaboration",
    "ColabCanvas"
  ],
  authors: [{ name: "ColabCanvas Team", url: "https://github.com/ParthKadam11/ColabCanvas" }],
  creator: "ColabCanvas Team",
  openGraph: {
    title: "ColabCanvas – Real-time Collaborative Whiteboard",
    description: "Draw, brainstorm, and collaborate in real-time with ColabCanvas.",
    url: "https://colabcanvas.com/",
    siteName: "ColabCanvas",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ColabCanvas – Real-time Collaborative Whiteboard"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ColabCanvas – Real-time Collaborative Whiteboard",
    description: "Draw, brainstorm, and collaborate in real-time with ColabCanvas.",
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
        <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="wK6o9NHbyALWjDTaXEkDSRHeyUP3gWFuGqioGXtCZ-w" />
      </head>
        <body className={"bg-black text-white " + `${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
