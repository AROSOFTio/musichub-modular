import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Clock3,
  Flame,
  Heart,
  Home,
  Library,
  ListMusic,
  Search,
  Shield,
  Tags,
  Trophy,
  Mic2,
  Info,
  Mail,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";
import { MODULE_KEYS } from "@/lib/modules/module-keys";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  moduleKey?: string;
  adminModuleKey?: string;
};

export const primaryNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: Home, moduleKey: MODULE_KEYS.home },
  { href: "/trending", label: "Trending", icon: Flame, moduleKey: MODULE_KEYS.trending },
  { href: "/latest", label: "Latest", icon: Clock3, moduleKey: MODULE_KEYS.latest },
  { href: "/top-50", label: "Top 50", icon: Trophy, moduleKey: MODULE_KEYS.top50 },
  { href: "/all-time", label: "All Time", icon: Activity, moduleKey: MODULE_KEYS.allTime },
  { href: "/genres", label: "Genres", icon: Tags, moduleKey: MODULE_KEYS.genres },
  { href: "/search", label: "Search", icon: Search, moduleKey: MODULE_KEYS.search },
  { href: "/library", label: "Library", icon: Library, moduleKey: MODULE_KEYS.library },
  { href: "/favorites", label: "Favorites", icon: Heart, moduleKey: MODULE_KEYS.favorites },
  { href: "/playlists", label: "Playlists", icon: ListMusic, moduleKey: MODULE_KEYS.playlists },
  { href: "/remix-studio", label: "Remix Studio", icon: SlidersHorizontal, moduleKey: MODULE_KEYS.remix },
];

export const secondaryNavigation: NavItem[] = [
  { href: "/artists", label: "Artists", icon: Mic2, moduleKey: MODULE_KEYS.artists },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail, moduleKey: MODULE_KEYS.contactSupport },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/admin", label: "Admin", icon: HelpCircle },
];

export const mobileNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: Home, moduleKey: MODULE_KEYS.home },
  { href: "/trending", label: "Trending", icon: Flame, moduleKey: MODULE_KEYS.trending },
  { href: "/library", label: "Library", icon: Library, moduleKey: MODULE_KEYS.library },
  { href: "/search", label: "Search", icon: Search, moduleKey: MODULE_KEYS.search },
];
