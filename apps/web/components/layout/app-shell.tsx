import { AudioPlayerBar } from "@/components/player/audio-player-bar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { ModuleRouteGuard } from "./module-route-guard";

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
        <main className="px-4 pb-20 pt-4 sm:px-6 lg:px-5 lg:pt-6">
          <div className="mx-auto max-w-[1600px]">
            <ModuleRouteGuard>{children}</ModuleRouteGuard>
          </div>
        </main>
        <Footer />
      </div>
      <AudioPlayerBar />
      <MobileBottomNav />
    </div>
  );
}
