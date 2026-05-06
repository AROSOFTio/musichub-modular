import type { LucideIcon } from "lucide-react";
import { Shield, Star, UploadCloud } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNavigation: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Shield },
];

export const secondaryNavigation: NavItem[] = [
  { href: "/admin/dashboard", label: "Upload music", icon: UploadCloud },
  { href: "/admin/dashboard", label: "Editor picks", icon: Star },
];

export const mobileNavigation: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Shield },
];
