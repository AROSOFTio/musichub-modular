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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eee8f8] bg-white px-3 py-2 lg:hidden">
      <div className={`mx-auto grid max-w-md ${gridCols} gap-1`}>
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-[10px] font-bold text-slate-500 transition",
                isActive && "text-violet-700",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-violet-50")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
