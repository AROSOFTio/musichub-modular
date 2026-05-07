import type { ModuleFlags, ModuleKey } from "./module-keys";

export type ModuleScopedItem = {
  moduleKey?: ModuleKey | string;
  adminModuleKey?: ModuleKey | string;
  requiredModuleKeys?: (ModuleKey | string)[];
};

export function hasModule(modules: ModuleFlags | null | undefined, key: ModuleKey | string | undefined) {
  if (!key) return true;
  if (!modules) return true;
  return modules[key] !== false;
}

export function hasModules(modules: ModuleFlags | null | undefined, keys: (ModuleKey | string | undefined)[]) {
  return keys.every((key) => hasModule(modules, key));
}

export function filterModuleItems<T extends ModuleScopedItem>(
  items: T[],
  modules: ModuleFlags | null | undefined,
  scope: "public" | "admin" = "public",
) {
  return items.filter((item) => (
    hasModule(modules, scope === "admin" ? item.adminModuleKey ?? item.moduleKey : item.moduleKey) &&
    hasModules(modules, item.requiredModuleKeys ?? [])
  ));
}
