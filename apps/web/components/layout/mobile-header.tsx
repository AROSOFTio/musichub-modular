"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "../ui/logo";
import { MobileDrawer } from "./mobile-drawer";

export function MobileHeader() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-borderSoft bg-[var(--background)] px-4 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileDrawer />
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Link className="button-secondary px-3 py-1.5 text-xs" href="/search">
            Search
          </Link>
          <Link 
            className="button-primary px-3 py-1.5 text-xs" 
            href={isAuthenticated ? "/admin/dashboard" : "/login"}
          >
            {isAuthenticated && user ? "Dashboard" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  );
}
