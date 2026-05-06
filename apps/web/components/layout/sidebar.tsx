"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Mail, Shield, HelpCircle } from "lucide-react";

import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { Logo } from "../ui/logo";

export function Sidebar() {
  const pathname = usePathname();

  const infoLinks = [
    { label: "About Us", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: Mail },
    { label: "Privacy", href: "/privacy", icon: Shield },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-borderSoft bg-[var(--card-bg)] px-5 py-6 lg:flex lg:flex-col">
      <Logo />
      
      <div className="flex-1 overflow-y-auto mt-8 pr-2 custom-scrollbar">
        <div className="space-y-2">
          {primaryNavigation.map((item) => {
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

        <div className="mt-8 border-t border-borderSoft pt-6">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Information
          </p>
          <div className="mt-3 space-y-2">
            {infoLinks.map((item) => {
              const isActive = pathname === item.href;

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

      <div className="mt-auto pt-6">
        <div className="rounded-3xl border border-borderSoft bg-[var(--surface)] p-5">
          <div className="flex items-center gap-2 text-violet-600">
            <HelpCircle className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Platform Rule</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Normal song downloads stay free. Remix monetization comes later.
          </p>
        </div>
      </div>
    </aside>
  );
}
