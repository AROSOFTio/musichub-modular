import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link className={cn("inline-flex items-center gap-3", className)} href="/">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-lg font-bold text-white">
        M
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-950">
        Musichub
      </span>
    </Link>
  );
}

