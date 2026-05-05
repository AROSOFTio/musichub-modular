import { SongList } from "@/components/catalog/song-list";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() || "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description={
          query
            ? `Results for "${query}" from the live catalog.`
            : "Search songs, artists, and genres from the live catalog."
        }
      />
      <SectionCard
        eyebrow="Catalog search"
        title={query ? "Matching songs" : "All published songs"}
        description="Search results are loaded from the API and PostgreSQL catalog."
      >
        <SongList emptyTitle="No matching songs found." query={query} />
      </SectionCard>
    </div>
  );
}
