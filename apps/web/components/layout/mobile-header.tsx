"use client";

import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { Logo } from "../ui/logo";
import { SearchBox } from "../ui/search-box";
import { MobileDrawer } from "./mobile-drawer";
import { NotificationsDropdown } from "./notifications";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const modules = useModules();

  return (
    <header className="sticky top-0 z-40 border-b border-[#eee8f8] bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Logo className="[&_img]:h-10" />
        <div className="flex items-center gap-2">
          {hasModule(modules, MODULE_KEYS.notifications) && isAuthenticated ? <NotificationsDropdown /> : null}
          <MobileDrawer />
        </div>
      </div>
      {hasModule(modules, MODULE_KEYS.search) ? (
        <div className="mt-3">
          <SearchBox />
        </div>
      ) : null}
    </header>
  );
}
