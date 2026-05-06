"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";

import { Logo } from "../ui/logo";

export function MobileHeader() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-borderSoft bg-[rgba(252,251,255,0.95)] px-4 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Link className="button-primary px-3 py-2" href={isAuthenticated ? "/admin/dashboard" : "/login"}>
            {isAuthenticated && user ? "Dashboard" : "Admin login"}
          </Link>
        </div>
      </div>
    </header>
  );
}

