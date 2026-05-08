"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import type { HomeEvent } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function UpcomingEventsSection({ events, modules }: { events?: HomeEvent[]; modules: ModuleFlags }) {
  if (!hasModule(modules, MODULE_KEYS.events)) return null;
  const visibleEvents = events ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--foreground)]">Upcoming Events</h2>
        <Link href="/contact" className="text-xs font-black text-violet-700">View all</Link>
      </div>
      {!visibleEvents.length ? (
        <div className="rounded-2xl border border-dashed border-borderSoft bg-[var(--card-bg)] p-6 text-sm text-[var(--muted)]">
          No upcoming events have been published yet.
        </div>
      ) : null}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {visibleEvents.map((event) => (
          <article key={event.id} className="flex w-80 shrink-0 gap-3 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 shadow-sm">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-50 text-violet-500">
              {event.image ? <img src={event.image} alt="" className="h-full w-full object-cover" /> : <CalendarDays className="h-7 w-7" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-black text-[var(--foreground)]">{event.title}</h3>
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--muted)]"><MapPin className="h-3 w-3" /> {event.location}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{formatDate(event.date)}</p>
              <Link href={event.ctaUrl || `/events/${event.slug}`} className="mt-3 inline-flex rounded-xl border border-violet-200 px-3 py-1.5 text-xs font-black text-violet-700 hover:bg-violet-50">{event.ctaLabel || "Learn More"}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
