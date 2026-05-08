import { AudioPlayerBar } from "@/components/player/audio-player-bar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { ModuleRouteGuard } from "./module-route-guard";

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f8f7ff] text-slate-950">
      <TopNav />
      <MobileHeader />
      <div className="mx-auto flex max-w-[1480px] gap-5 px-4 pb-32 pt-4 sm:px-6 lg:px-7 lg:pb-28 lg:pt-5">
        <Sidebar />
        <main className="min-w-0 flex-1 rounded-[1.75rem] border border-[#ece7f7] bg-white px-4 py-5 shadow-[0_18px_50px_rgba(91,33,182,0.06)] sm:px-6 lg:px-7">
          <ModuleRouteGuard>{children}</ModuleRouteGuard>
        </main>
      </div>
      <AudioPlayerBar />
      <MobileBottomNav />
    </div>
  );
}
