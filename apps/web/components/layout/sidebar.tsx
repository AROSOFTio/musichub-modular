"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";
import { filterModuleItems } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { cn } from "@/lib/utils";

import { Logo } from "../ui/logo";

export function Sidebar() {
  const pathname = usePathname();
  const modules = useModules();
  const primaryItems = filterModuleItems(primaryNavigation, modules);
  const secondaryItems = filterModuleItems(secondaryNavigation, modules);

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-borderSoft bg-[var(--card-bg)] px-5 py-6 lg:flex lg:flex-col">
      <Logo />
      
      <div className="flex-1 overflow-y-auto mt-8 pr-2 custom-scrollbar">
        <div className="space-y-2">
            {primaryItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

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
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Explore
          </p>
          <div className="mt-3 space-y-2">
            {secondaryItems.map((item) => {
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

      </div>

    </aside>
  );
}
