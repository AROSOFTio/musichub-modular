import Link from "next/link";

export function EntityCard({
  href,
  title,
  meta,
  image,
}: {
  href: string;
  title: string;
  meta?: string;
  image?: string | null;
}) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-4 shadow-sm transition hover:border-violet-200 hover:shadow-card">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-50 text-lg font-black text-violet-700">
        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : title.charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-black text-[var(--foreground)]">{title}</span>
        {meta ? <span className="mt-1 block truncate text-sm text-[var(--muted)]">{meta}</span> : null}
      </span>
    </Link>
  );
}
