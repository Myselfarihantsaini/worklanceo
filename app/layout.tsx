import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://worklanceo.com"),
  title: {
    default: "WorkLanceo | Recruitment & Workforce Solutions",
    template: "%s | WorkLanceo",
  },
  description:
    "Build your team with WorkLanceo. Recruitment, bulk hiring, staffing and workforce solutions for India.",
  alternates: {
    canonical: "https://worklanceo.com",
  },
  openGraph: {
    title: "WorkLanceo | Recruitment & Workforce Solutions",
    description:
      "From your first hire to your next hundred. Recruitment, bulk hiring, staffing and workforce solutions for India.",
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
    title: "WorkLanceo | Recruitment & Workforce Solutions",
    description:
      "From your first hire to your next hundred. Recruitment, bulk hiring, staffing and workforce solutions for India.",
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
