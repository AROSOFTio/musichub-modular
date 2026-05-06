"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Image,
  LayoutDashboard,
  Library,
  Mic2,
  Music,
  Music2,
  Settings,
  Sliders,
  Star,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Dashboard",
    items: [
      { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
    ],
  },
  {
    section: "Music Management",
    items: [
      {
        label: "Songs",
        href: "/admin/songs",
        icon: Music2,
        children: [
          { label: "All Songs", href: "/admin/songs" },
          { label: "Add Song", href: "/admin/songs/new" },
          { label: "Drafts", href: "/admin/songs/drafts" },
          { label: "Scheduled", href: "/admin/songs/scheduled" },
          { label: "Reported", href: "/admin/songs/reported" },
          { label: "Disabled", href: "/admin/songs/disabled" },
        ],
      },
      {
        label: "Artists",
        href: "/admin/artists",
        icon: Mic2,
        children: [
          { label: "All Artists", href: "/admin/artists" },
          { label: "Add Artist", href: "/admin/artists/new" },
          { label: "Verified", href: "/admin/artists/verified" },
          { label: "Pending", href: "/admin/artists/pending" },
        ],
      },
      {
        label: "Albums",
        href: "/admin/albums",
        icon: Library,
        children: [
          { label: "All Albums", href: "/admin/albums" },
          { label: "Create Album", href: "/admin/albums/new" },
        ],
      },
      {
        label: "Genres",
        href: "/admin/genres",
        icon: Tag,
        children: [
          { label: "All Genres", href: "/admin/genres" },
          { label: "Add Genre", href: "/admin/genres/new" },
        ],
      },
      {
        label: "Music Types",
        href: "/admin/music-types",
        icon: Music,
        children: [
          { label: "All Types", href: "/admin/music-types" },
          { label: "Add Type", href: "/admin/music-types/new" },
          { label: "Moods", href: "/admin/music-types/moods" },
          { label: "Categories", href: "/admin/music-types/categories" },
        ],
      },
    ],
  },
  {
    section: "Discovery Control",
    items: [
      {
        label: "Trending",
        href: "/admin/trending",
        icon: TrendingUp,
        children: [
          { label: "Trending Songs", href: "/admin/trending" },
          { label: "Top 50", href: "/admin/trending/top-50" },
          { label: "All Time", href: "/admin/trending/all-time" },
          { label: "Settings", href: "/admin/trending/settings" },
        ],
      },
      {
        label: "Editor Picks",
        href: "/admin/editor-picks",
        icon: Star,
        children: [
          { label: "Active Picks", href: "/admin/editor-picks" },
          { label: "Add Pick", href: "/admin/editor-picks/new" },
          { label: "Reorder", href: "/admin/editor-picks/reorder" },
        ],
      },
      {
        label: "Hero Banners",
        href: "/admin/hero-banners",
        icon: Image,
        children: [
          { label: "Active Banners", href: "/admin/hero-banners" },
          { label: "Create Banner", href: "/admin/hero-banners/new" },
          { label: "Scheduled", href: "/admin/hero-banners/scheduled" },
        ],
      },
    ],
  },
];

function NavGroup({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-violet-700 text-white"
            : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
          isActive ? "text-violet-700" : "text-slate-500"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </div>
      <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
        {item.children.map((child) => {
          const childActive = pathname === child.href;
          return (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                childActive
                  ? "bg-violet-50 font-semibold text-violet-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <Logo />
        <button
          onClick={onClose}
          className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavGroup key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-violet-600"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          View public site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
        {content}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
