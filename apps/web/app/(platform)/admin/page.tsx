import { AdminOverviewCard } from "@/components/dashboard/admin-overview-card";
import { SongManager } from "@/components/dashboard/song-manager";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        description="Upload songs, publish releases, and verify protected catalog controls."
      />
      <SongManager />
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <AdminOverviewCard />
        <SectionCard
          eyebrow="Access model"
          title="This dashboard only becomes useful after admin login."
          description="The protected API endpoint behind this page is guarded with JWT authentication plus ADMIN role checks."
        >
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
            <li>Seed one admin account with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.</li>
            <li>Sign in through the web app or call the login API directly.</li>
            <li>Open this route to confirm role-based access control works.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
