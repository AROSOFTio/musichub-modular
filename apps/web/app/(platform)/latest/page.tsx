import { SongList } from "@/components/catalog/song-list";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function LatestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Latest"
        description="Recently published uploads from the Musichub catalog."
      />
      <SectionCard
        eyebrow="Catalog"
        title="Latest uploads"
        description="Songs appear here after an admin or artist uploads and publishes them."
      >
        <SongList />
      </SectionCard>
    </div>
  );
}
