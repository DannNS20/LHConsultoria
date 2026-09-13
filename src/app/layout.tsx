import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} · Despacho contable`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
