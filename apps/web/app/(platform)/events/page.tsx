import { EntityCard } from "@/components/seo/entity-card";
import type { HomeEvent } from "@/lib/api";
import { pageMetadata, serverApi } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Upcoming Music Events",
  description: "Discover upcoming music events, concerts and live experiences published on Musichub.",
  path: "/events",
});

export default async function EventsPage() {
  const events = await serverApi<HomeEvent[]>("/events") ?? [];
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6 shadow-card">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Upcoming Events</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">Find music events and live experiences published by the Musichub team.</p>
      </section>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => <EntityCard key={event.id} href={`/events/${event.slug}`} title={event.title} image={event.image} meta={`${event.location} · ${new Date(event.date).toLocaleDateString()}`} />)}
      </div>
    </div>
  );
}
