import { AudioPlayerBar } from "@/components/player/audio-player-bar";

import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="lg:pl-72">
        <MobileHeader />
        <TopNav />
        <main className="px-4 pb-40 pt-4 sm:px-6 lg:px-8 lg:pb-28 lg:pt-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <AudioPlayerBar />
      <MobileBottomNav />
    </div>
  );
}

