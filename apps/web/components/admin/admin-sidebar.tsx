"use client";

import { useEffect, useMemo, useState } from "react";
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
  Users,
  ChevronDown,
  Moon,
  Sun,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { listAdminModules } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  moduleKey?: string;
  children?: { label: string; href: string }[];
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Dashboard",
    items: [
      { label: "Overview", href: "/admin/overview", icon: LayoutDashboard, moduleKey: MODULE_KEYS.adminDashboard },
      { label: "Users", href: "/admin/users", icon: Users, moduleKey: MODULE_KEYS.adminUsers },
      { label: "Modules", href: "/admin/modules", icon: Sliders, moduleKey: MODULE_KEYS.adminModules },
    ],
  },
  {
    section: "Music Management",
    items: [
      {
        label: "Songs",
        href: "/admin/songs",
        icon: Music2,
        moduleKey: MODULE_KEYS.adminSongs,
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
        moduleKey: MODULE_KEYS.adminArtists,
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
        moduleKey: MODULE_KEYS.adminAlbums,
        children: [
          { label: "All Albums", href: "/admin/albums" },
          { label: "Create Album", href: "/admin/albums/new" },
        ],
      },
      {
        label: "Genres",
        href: "/admin/genres",
        icon: Tag,
        moduleKey: MODULE_KEYS.adminGenres,
        children: [
          { label: "All Genres", href: "/admin/genres" },
          { label: "Add Genre", href: "/admin/genres/new" },
        ],
      },
      {
        label: "Music Types",
        href: "/admin/music-types",
        icon: Music,
        moduleKey: MODULE_KEYS.adminMusicTypes,
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
        moduleKey: MODULE_KEYS.adminTrending,
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
        moduleKey: MODULE_KEYS.adminEditorPicks,
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
        moduleKey: MODULE_KEYS.adminHeroBanners,
        children: [
          { label: "Active Banners", href: "/admin/hero-banners" },
          { label: "Create Banner", href: "/admin/hero-banners/new" },
          { label: "Scheduled", href: "/admin/hero-banners/scheduled" },
        ],
      },
    ],
  },
  {
    section: "Support",
    items: [
      { label: "Messages", href: "/admin/messages", icon: Mail, moduleKey: MODULE_KEYS.adminMessages },
    ],
  },
];

function NavGroup({
  item,
  pathname,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
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
            : "text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/50 hover:text-violet-700 dark:hover:text-violet-300"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive || isOpen
            ? "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-3">
          {item.children.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  childActive
                    ? "bg-violet-100 dark:bg-violet-900/50 font-semibold text-violet-700 dark:text-violet-300"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark") || localStorage.theme === "dark";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-xl p-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      title="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="lg:hidden">{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
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
  const modules = useModules();
  const { accessToken, user } = useAuth();
  const [adminModules, setAdminModules] = useState<Record<string, boolean> | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  useEffect(() => {
    listAdminModules(accessToken ?? undefined)
      .then((payload) => {
        setAdminModules(payload.flat.reduce<Record<string, boolean>>((flags, module) => {
          flags[module.key] = module.enabledAdmin;
          return flags;
        }, {}));
      })
      .catch(() => setAdminModules(null));
  }, [accessToken]);
  const effectiveModules =
    user?.role === "DEV_ADMIN"
      ? { admin_modules: true, admin_settings: true }
      : adminModules ?? { ...modules, admin_modules: false };
  const navGroups = useMemo(() => NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasModule(effectiveModules, item.moduleKey)),
  })).filter((group) => group.items.length > 0), [effectiveModules]);

  // Automatically open the group containing the active link
  useEffect(() => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.children && (pathname === item.href || pathname.startsWith(item.href + "/"))) {
          setOpenGroup(item.label);
        }
      }
    }
  }, [pathname, navGroups]);

  const handleToggle = (label: string) => {
    setOpenGroup((prev) => (prev === label ? null : label));
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavGroup
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  isOpen={openGroup === item.label}
                  onToggle={() => handleToggle(item.label)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          View public site
        </Link>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 dark:lg:border-slate-800 bg-slate-50 dark:bg-slate-950">
        {content}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
