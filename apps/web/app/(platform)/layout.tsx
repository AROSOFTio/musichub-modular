"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth-context";

export default function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    // If we are on an admin page and not logged in (and not loading), redirect to login
    if (isAdmin && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  // While checking auth for admin pages, show nothing or a loader
  if (isAdmin && (isLoading || !isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
