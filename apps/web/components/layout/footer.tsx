"use client";

import Link from "next/link";
import { Mail, Github, Twitter, Instagram, Facebook, ExternalLink } from "lucide-react";
import { Logo } from "../ui/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/" },
        { label: "Trending", href: "/trending" },
        { label: "Latest Uploads", href: "/latest" },
        { label: "Genres", href: "/genres" },
        { label: "Popular Artists", href: "/artists" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "About MusicHub", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "For Artists",
      links: [
        { label: "Artist Login", href: "/login" },
        { label: "Upload Music", href: "/admin/songs/new" },
        { label: "Verification", href: "/about" },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-borderSoft bg-[var(--card-bg)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Logo & About Section */}
          <div className="space-y-6">
            <Logo />
            <p className="text-sm leading-6 text-[var(--muted)]">
              MusicHub is a premier music streaming platform dedicated to independent artists. 
              Discover, stream, and download high-quality music for free.
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
              <Link href="mailto:support@musichub.arosoft.io" className="text-[var(--muted)] hover:text-violet-600 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
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
