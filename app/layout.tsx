import type { Metadata, Viewport } from "next";
import "./globals.css";

// themeColor belongs on the viewport export, not metadata, and only the array
// form can carry a media query. Without the dark entry the phone keeps painting
// the status bar deep green over a near-black page at night.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d684d" },
    { media: "(prefers-color-scheme: dark)", color: "#14181a" },
  ],
};

export const metadata: Metadata = {
  title: "Builder Bench",
  description: "Your local Salesforce Platform App Builder study coach.",
  manifest: "/site.webmanifest",
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
