import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Builder Bench",
  description: "Your local Salesforce Platform App Builder study coach.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
