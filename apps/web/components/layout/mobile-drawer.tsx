"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "../ui/logo";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";
import { filterModuleItems } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const modules = useModules();
  const canAccessAdmin = user?.role === "ADMIN" || user?.role === "DEV_ADMIN";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  function handleLogout() {
    logout();
    setIsOpen(false);
    router.push("/");
  }

  const navItems = filterModuleItems([...primaryNavigation, ...secondaryNavigation], modules);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-[var(--card-bg)] text-[var(--foreground)]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer panel — flex column so footer is always at bottom */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <Logo />
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Nav links — grows & scrolls ───────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {isAuthenticated && canAccessAdmin && (
            <Link
              href="/admin/dashboard"
              className="mb-3 flex items-center gap-4 rounded-2xl bg-violet-50 px-4 py-3.5 text-base font-bold text-violet-700 transition-colors dark:bg-violet-900/20 dark:text-violet-300"
            >
              <LayoutDashboard className="h-5 w-5" />
              Admin Dashboard
            </Link>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-slate-700 hover:bg-violet-50 dark:text-slate-200 dark:hover:bg-violet-900/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-violet-600")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer — pinned, fully opaque ─────────────────────── */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-4 space-y-2 dark:border-slate-800 dark:bg-slate-950">
          {isAuthenticated ? (
            <>
              {user && (
                <p className="truncate px-1 text-sm text-slate-500 dark:text-slate-400">
                  Signed in as{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {user.displayName || user.email}
                  </span>
                </p>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3.5 text-base font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Log In
            </Link>
          )}
          <p className="text-center text-xs text-slate-400 pt-1">MusicHub by AROSOFT</p>
        </div>
      </div>
    </>
  );
}
