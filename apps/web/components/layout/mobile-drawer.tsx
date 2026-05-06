"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Home, Compass, Clock, Star, Info, Shield, Mail, Menu } from "lucide-react";
import { Logo } from "../ui/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Trending", href: "/trending", icon: Compass },
    { label: "Latest", href: "/latest", icon: Clock },
    { label: "Editor's Picks", href: "/editor-picks", icon: Star },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: Mail },
    { label: "Privacy Policy", href: "/privacy", icon: Shield },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-[var(--card-bg)] text-[var(--foreground)]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform bg-[var(--card-bg)] px-6 py-6 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-[var(--foreground)] hover:bg-violet-50 dark:hover:bg-violet-900/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-violet-600")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-10 left-6 right-6">
          <div className="rounded-3xl border border-borderSoft bg-[var(--surface)] p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">MusicHub</p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Stream and download your favorite music for free.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
