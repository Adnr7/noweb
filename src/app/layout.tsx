import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "noweb.site — Software Engineer | Interactive Portfolio",
  description:
    "Award-winning interactive portfolio of a Software Engineer specializing in Cloud Computing, Blockchain, and AI/ML. Built with Next.js, Three.js, and GSAP.",
  keywords: [
    "Software Engineer",
    "Portfolio",
    "Cloud Computing",
    "Blockchain",
    "AI/ML",
    "WebGL",
    "Three.js",
  ],
  openGraph: {
    title: "noweb.site — Software Engineer",
    description:
      "An immersive digital portfolio blending WebGL and editorial design.",
    url: "https://noweb.site",
    siteName: "noweb.site",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable}`}
        style={{
          fontFamily: "var(--font-inter), var(--font-sans)",
        }}
        suppressHydrationWarning
      >
        <CustomCursor />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
