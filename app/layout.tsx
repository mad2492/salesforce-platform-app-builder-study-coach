import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Builder Bench",
  description: "Your local Salesforce Platform App Builder study coach.",
  manifest: "/site.webmanifest",
  themeColor: "#0d684d",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Builder Bench",
  },
  icons: {
    apple: "/builder-bench-icon-180.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
