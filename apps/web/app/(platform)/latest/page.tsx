import { Clock3 } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function LatestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Latest"
        description="The latest releases feed will populate from real uploads once song management is introduced."
      />
      <SectionCard
        eyebrow="Catalog status"
        title="Upload-backed release ordering starts in the next content phase."
        description="This route already lives inside the production app shell, so only the data layer needs to be added later."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Clock3 className="h-4 w-4 text-violet-700" />
          No published tracks are stored yet.
        </div>
      </SectionCard>
    </div>
  );
}

