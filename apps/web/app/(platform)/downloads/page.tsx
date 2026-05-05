import { Download } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function DownloadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Downloads"
        description="Musichub keeps standard song downloads free. Remix monetization is intentionally postponed to a later phase."
      />
      <SectionCard
        eyebrow="Policy"
        title="Download rules are defined now, even though track delivery lands later."
        description="The page documents the core platform rule so the rest of the system can follow it consistently."
      >
        <div className="mt-4 rounded-3xl border border-borderSoft bg-surface p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <Download className="h-4 w-4 text-violet-700" />
            Free normal downloads are enabled by product policy.
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Paid or Pro remix downloads will be introduced only when the remix
            workflow and FFmpeg processing are added.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

