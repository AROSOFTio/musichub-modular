import { ListMusic } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function PlaylistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description="Playlist management is reserved for the catalog phase so it can sit on top of real tracks."
      />
      <SectionCard
        eyebrow="Collections"
        title="Playlist storage is deferred, but the route and layout are already stable."
        description="That keeps the shell production-safe while avoiding fabricated content."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <ListMusic className="h-4 w-4 text-violet-700" />
          Playlist creation starts after track ingestion.
        </div>
      </SectionCard>
    </div>
  );
}

