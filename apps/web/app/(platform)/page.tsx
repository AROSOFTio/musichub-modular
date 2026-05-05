import Link from "next/link";

import { SongList } from "@/components/catalog/song-list";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Musichub"
        description="Stream uploaded songs, open clean song pages, and download normal tracks for free."
        action={
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary" href="/latest">
              Latest uploads
            </Link>
            <Link className="button-secondary" href="/admin">
              Upload song
            </Link>
          </div>
        }
      />

      <SectionCard
        eyebrow="Published songs"
        title="Latest music on Musichub"
        description="This list is loaded from the production API and database."
      >
        <SongList />
      </SectionCard>
    </div>
  );
}
