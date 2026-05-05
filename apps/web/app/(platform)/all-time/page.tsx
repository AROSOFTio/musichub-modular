import { BarChart3 } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function AllTimePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="All Time"
        description="The all-time leaderboard route is prepared for long-term ranking data."
      />
      <SectionCard
        eyebrow="History"
        title="Long-horizon charts arrive after the catalog, metrics, and moderation workflows."
        description="For now, the route exists so the navigation and responsive layout stay stable as features grow."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <BarChart3 className="h-4 w-4 text-violet-700" />
          No historical ranking baseline exists in Phase 1.
        </div>
      </SectionCard>
    </div>
  );
}

