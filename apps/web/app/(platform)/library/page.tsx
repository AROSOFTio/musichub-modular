import { Library } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Library management will come online when saved tracks and playlists are persisted."
      />
      <SectionCard
        eyebrow="User content"
        title="Personal library data is not created until the song model exists."
        description="The route is live now so user-facing navigation remains stable while the backend grows."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Library className="h-4 w-4 text-violet-700" />
          Sign in now, then add saved content in a later phase.
        </div>
      </SectionCard>
    </div>
  );
}

