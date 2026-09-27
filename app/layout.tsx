import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkLanceo | Recruitment & Workforce Solutions",
  description: "Build your team with WorkLanceo. Recruitment, bulk hiring, staffing and workforce solutions for India.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/worklanceo-logo.png",
    shortcut: "/worklanceo-logo.png",
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
