"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileNavigation } from "@/lib/navigation";
import { filterModuleItems } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const modules = useModules();
  const items = filterModuleItems(mobileNavigation, modules).slice(0, 5);
  const gridCols = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5"][
    Math.max(1, Math.min(5, items.length))
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-borderSoft bg-[var(--card-bg)]/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className={`mx-auto grid max-w-md ${gridCols} gap-2`}>
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-[var(--muted)] transition",
                isActive && "bg-violet-50 text-violet-700",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
