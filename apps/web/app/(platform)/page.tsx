import Link from "next/link";
import { ArrowRight, Cloud, Download, Headphones, ShieldCheck } from "lucide-react";

import { AuthSummaryCard } from "@/components/auth/auth-summary-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Production foundation for Musichub"
        description="A clean white-and-purple streaming shell with real authentication, API health checks, deployable containers, and a player state model ready for catalog features."
        action={
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary" href="/register">
              Create account
            </Link>
            <Link className="button-secondary" href="/login">
              Sign in
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <SectionCard
          eyebrow="Platform status"
          title="Phase 1 ships the core system layer, not sample catalog data."
          description="The interface stays intentionally clean while the API, database, and session flow are wired to real runtime services."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-borderSoft bg-surface p-5">
              <ShieldCheck className="h-5 w-5 text-violet-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                Auth and roles
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Register, login, refresh, logout, and role-aware admin access are
                connected to PostgreSQL through Prisma.
              </p>
            </div>

            <div className="rounded-3xl border border-borderSoft bg-surface p-5">
              <Cloud className="h-5 w-5 text-violet-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                Deployable containers
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Docker Compose now orchestrates the web app, API, PostgreSQL, Redis,
                and a PostgreSQL-compatible admin UI.
              </p>
            </div>

            <div className="rounded-3xl border border-borderSoft bg-surface p-5">
              <Download className="h-5 w-5 text-violet-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                Free downloads preserved
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Normal song downloads remain free by platform rule. Remix payment
                logic is intentionally deferred.
              </p>
            </div>

            <div className="rounded-3xl border border-borderSoft bg-surface p-5">
              <Headphones className="h-5 w-5 text-violet-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                Real player state
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                The sticky audio bar is backed by a reusable state store, ready to be
                connected to stream URLs once songs exist.
              </p>
            </div>
          </div>
        </SectionCard>

        <AuthSummaryCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          title="Latest"
          description="Prepare the release stream and verify the responsive listing shell."
        >
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700" href="/latest">
            Open latest releases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>

        <SectionCard
          title="Downloads"
          description="Track the free-download rule and reserve remix monetization for a later phase."
        >
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700" href="/downloads">
            Review download policy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>

        <SectionCard
          title="Admin dashboard"
          description="Use the admin seed account to verify protected API access and role enforcement."
        >
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700" href="/admin">
            Open admin area
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}
