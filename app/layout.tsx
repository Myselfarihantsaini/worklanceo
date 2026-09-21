import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaamSetu | Recruitment & Workforce Solutions",
  description: "Find work. Build teams. Recruitment, bulk hiring, staffing and workforce solutions for India.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
