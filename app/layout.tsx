import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://worklanceo.com"),
  title: {
    default: "WorkLanceo | Recruitment & Workforce Hiring Across Every Sector",
    template: "%s | WorkLanceo",
  },
  description:
    "WorkLanceo helps businesses hire pre-screened candidates across industries including corporate, retail, manufacturing, logistics, hospitality, healthcare, BPO, technology and more.",
  alternates: {
    canonical: "https://worklanceo.com",
  },
  openGraph: {
    title: "WorkLanceo | Recruitment & Workforce Hiring Across Every Sector",
    description:
      "One partner. Every workforce need. Recruitment and hiring across all sectors.",
    url: "https://worklanceo.com",
    siteName: "WorkLanceo",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/worklanceo-logo.png",
        width: 646,
        height: 590,
        alt: "WorkLanceo Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkLanceo | Recruitment & Workforce Hiring Across Every Sector",
    description:
      "One partner. Every workforce need. Recruitment and hiring across all sectors.",
    images: ["/worklanceo-logo.png"],
  },
  icons: {
    icon: "/worklanceo-logo.png",
    shortcut: "/worklanceo-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
