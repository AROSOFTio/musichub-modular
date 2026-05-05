import { Heart } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Favorites"
        description="Favorites will be stored against authenticated users once track models are introduced."
      />
      <SectionCard
        eyebrow="Personalization"
        title="This page is intentionally empty until catalog entities exist."
        description="The current goal is to preserve a real route and clean layout without inventing fake song data."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Heart className="h-4 w-4 text-violet-700" />
          Favorite actions unlock after track publishing is in place.
        </div>
      </SectionCard>
    </div>
  );
}

