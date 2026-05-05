import { SongManager } from "@/components/dashboard/song-manager";
import { PageHeader } from "@/components/ui/page-header";

export default function ArtistPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Artist dashboard"
        description="Upload songs, manage releases, and publish tracks to the public catalog."
      />
      <SongManager />
    </div>
  );
}
