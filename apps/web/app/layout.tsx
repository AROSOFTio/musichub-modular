import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:4008";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Musichub",
    template: "%s | Musichub",
  },
  description: "Musichub is a public music streaming and free-download platform with an admin dashboard for uploads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
