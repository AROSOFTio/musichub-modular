import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Clock3,
  Download,
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
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/latest", label: "Latest", icon: Clock3 },
  { href: "/top-50", label: "Top 50", icon: Trophy },
  { href: "/all-time", label: "All Time", icon: Activity },
  { href: "/genres", label: "Genres", icon: Tags },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
  { href: "/downloads", label: "Downloads", icon: Download },
];

export const secondaryNavigation: NavItem[] = [
  { href: "/artists", label: "Artists", icon: Mic2 },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/admin", label: "Admin", icon: HelpCircle },
];

export const mobileNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/downloads", label: "Downloads", icon: Download },
];
