"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ExternalLink } from "lucide-react";
import { Logo } from "../ui/logo";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import type { ModuleKey } from "@/lib/modules/module-keys";
import { filterModuleItems } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

type FooterLink = {
  label: string;
  href: string;
  moduleKey?: ModuleKey;
};

type FooterSection = {
  title: string;
  moduleKey?: ModuleKey;
  links: FooterLink[];
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const modules = useModules();

  const footerSections: FooterSection[] = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/", moduleKey: MODULE_KEYS.home },
        { label: "Trending", href: "/trending", moduleKey: MODULE_KEYS.trending },
        { label: "Latest Uploads", href: "/latest", moduleKey: MODULE_KEYS.latest },
        { label: "Genres", href: "/genres", moduleKey: MODULE_KEYS.genres },
        { label: "Popular Artists", href: "/artists", moduleKey: MODULE_KEYS.artists },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact", moduleKey: MODULE_KEYS.contactSupport },
        { label: "About MusicHub", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "For Artists",
      moduleKey: MODULE_KEYS.artistRegistration,
      links: [
        { label: "Artist Registration", href: "/register?type=artist", moduleKey: MODULE_KEYS.artistRegistration },
        { label: "Upload Music", href: "/admin/songs/new", moduleKey: MODULE_KEYS.upload },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-borderSoft bg-slate-50 dark:bg-slate-900/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Logo & About Section */}
          <div className="space-y-6">
            <Logo />
            <p className="text-sm leading-6 text-[var(--muted)]">
              MusicHub is a premier music streaming platform dedicated to independent artists. 
              Discover and stream high-quality music from independent artists.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-[var(--muted)] hover:text-violet-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[var(--muted)] hover:text-violet-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[var(--muted)] hover:text-violet-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.filter((section) => !section.moduleKey || modules[section.moduleKey] !== false).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {filterModuleItems(section.links, modules).map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-violet-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-borderSoft pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--muted)]">
              &copy; {currentYear} MusicHub. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <span>Developed & Maintained by</span>
              <Link
                href="https://arosoft.io"
                target="_blank"
                className="flex items-center gap-1 font-bold text-violet-600 hover:underline"
              >
                AROSOFT <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
