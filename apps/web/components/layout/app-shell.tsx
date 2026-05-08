import { AudioPlayerBar } from "@/components/player/audio-player-bar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { ModuleRouteGuard } from "./module-route-guard";

function PublicAdRail({ label }: { label: string }) {
  return (
    <aside
      aria-label={label}
      className="sticky top-28 hidden h-[calc(100vh-9rem)] rounded-2xl border border-dashed border-borderSoft bg-[var(--card-bg)]/80 p-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] shadow-sm xl:flex xl:items-center xl:justify-center"
    >
      <span>{label}</span>
    </aside>
  );
}

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div>
        <MobileHeader />
        <TopNav />
        <main className="px-4 pb-28 pt-4 sm:px-6 lg:px-5 lg:pb-32 lg:pt-6">
          <div className="mx-auto grid w-full max-w-[1700px] gap-6 xl:grid-cols-[minmax(120px,15%)_minmax(0,70%)_minmax(120px,15%)]">
            <PublicAdRail label="Advert" />
            <div className="min-w-0">
              <ModuleRouteGuard>{children}</ModuleRouteGuard>
            </div>
            <PublicAdRail label="Advert" />
          </div>
        </main>
        <Footer />
      </div>
      <AudioPlayerBar />
      <MobileBottomNav />
    </div>
  );
}
