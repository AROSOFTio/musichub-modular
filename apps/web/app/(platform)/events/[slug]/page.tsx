import type { HomeEvent } from "@/lib/api";
import { breadcrumbJsonLd, eventJsonLd, jsonLd, pageMetadata, serverApi } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await serverApi<HomeEvent>(`/events/${encodeURIComponent(params.slug)}`);
  if (!event) return pageMetadata({ title: "Event not found", description: "This event could not be found on Musichub.", path: `/events/${params.slug}`, noIndex: true });
  return pageMetadata({
    title: event.title,
    description: `${event.title} in ${event.location}. View event details on Musichub.`,
    path: `/events/${event.slug}`,
    image: event.image,
  });
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await serverApi<HomeEvent>(`/events/${encodeURIComponent(params.slug)}`);
  if (!event) return null;
  return (
    <div className="space-y-6">
      {jsonLd([eventJsonLd(event), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: event.title, path: `/events/${event.slug}` }])])}
      <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6 shadow-card">
        {event.image ? <img src={event.image} alt="" className="mb-6 h-64 w-full rounded-2xl object-cover" /> : null}
        <h1 className="text-3xl font-black text-[var(--foreground)]">{event.title}</h1>
        <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{event.location} - {new Date(event.date).toLocaleDateString()}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">Event information, location and timing for {event.title}.</p>
      </section>
    </div>
  );
}
