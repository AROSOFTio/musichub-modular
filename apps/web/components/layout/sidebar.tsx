"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { Logo } from "../ui/logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-borderSoft bg-white px-5 py-6 lg:flex lg:flex-col">
      <Logo />
      <div className="mt-8 space-y-2">
        {primaryNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-link", isActive && "sidebar-link-active")}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 border-t border-borderSoft pt-6">
        <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Dashboards
        </p>
        <div className="mt-3 space-y-2">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("sidebar-link", isActive && "sidebar-link-active")}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto rounded-3xl border border-borderSoft bg-surface p-5">
        <p className="text-sm font-semibold text-slate-950">Platform rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Normal song downloads stay free. Remix monetization comes later, after the
          core catalog and upload pipeline are in place.
        </p>
      </div>
    </aside>
  );
}

