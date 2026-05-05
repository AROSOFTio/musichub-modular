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
  description:
    "Musichub is a production-ready music streaming and free-download platform foundation built with Next.js and NestJS.",
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

