import { Search } from "lucide-react";

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
        description="The search route is ready to accept real query traffic once songs, artists, and playlists exist."
      />
      <SectionCard
        eyebrow="Query capture"
        title={query ? `Search prepared for "${query}".` : "Search input is connected to the shell."}
        description="Phase 1 captures the route and query string cleanly. Actual search indexing lands with the catalog modules."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Search className="h-4 w-4 text-violet-700" />
          {query ? "Query received and routed." : "Use the search bar to test routing."}
        </div>
      </SectionCard>
    </div>
  );
}
