import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth-context";

import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:4008";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Musichub",
    template: "%s | Musichub",
  },
  description: "Musichub admin dashboard for uploading and managing music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

