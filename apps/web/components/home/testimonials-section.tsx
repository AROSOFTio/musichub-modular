"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import type { HomeTestimonial } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

export function TestimonialsSection({ testimonials, modules }: { testimonials?: HomeTestimonial[]; modules: ModuleFlags }) {
  if (!hasModule(modules, MODULE_KEYS.testimonials)) return null;
  const visible = testimonials ?? [];

  return (
    <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-[var(--foreground)]">What People Say</h2>
        <Link href="/admin" className="text-xs font-black text-violet-700">Admin posts</Link>
      </div>
      {!visible.length ? (
        <div className="rounded-2xl border border-dashed border-borderSoft bg-[var(--surface)] p-5 text-sm text-[var(--muted)]">
          No public testimonials have been published yet.
        </div>
      ) : null}
      <div className="space-y-4">
        {visible.slice(0, 2).map((item) => (
          <article key={item.id} className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-50 text-sm font-black text-violet-700">
              {item.avatar ? <img src={item.avatar} alt="" className="h-full w-full object-cover" /> : item.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-5 text-[var(--foreground)]">{item.text}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-[var(--foreground)]">{item.name}</span>
                {item.rating ? (
                  <span className="flex gap-0.5 text-violet-600">{Array.from({ length: Math.min(5, item.rating) }).map((_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}</span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
