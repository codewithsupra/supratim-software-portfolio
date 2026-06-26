import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  title: "Supratim Sarkar — Software Engineer",
  description:
    "Software Engineer specialising in local-first systems, AI engineering, and full-stack TypeScript. M.Sc. Software Engineering (VU Amsterdam × UvA). AWS SAA-C03 certified.",
  keywords: [
    "Supratim Sarkar",
    "Software Engineer",
    "TypeScript",
    "React",
    "Next.js",
    "Local-First",
    "Yjs",
    "CRDTs",
    "AI Engineering",
    "Full-Stack",
  ],
  authors: [{ name: "Supratim Sarkar", url: "https://github.com/codewithsupra" }],
  openGraph: {
    title: "Supratim Sarkar — Software Engineer",
    description:
      "Software Engineer specialising in local-first systems, AI engineering, and full-stack TypeScript.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supratim Sarkar — Software Engineer",
    description:
      "Software Engineer specialising in local-first systems, AI engineering, and full-stack TypeScript.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Supratim Sarkar",
  url: "https://supratimsarkar.dev",
  sameAs: [
    "https://github.com/codewithsupra",
    "https://linkedin.com/in/supratimsarkar99",
  ],
  jobTitle: "Software Engineer",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "VU Amsterdam" },
    { "@type": "CollegeOrUniversity", name: "University of Amsterdam" },
  ],
  knowsAbout: ["TypeScript", "React", "Next.js", "Local-First Systems", "AI Engineering", "CRDTs"],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
