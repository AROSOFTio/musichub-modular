"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const logoSources = [
  "/brand/musichub-logo.png",
  "/brand/musichub-logo.svg",
  "/brand/musichub-logo.webp",
];

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = logoSources[sourceIndex];

  return (
    <Link className={cn("inline-flex items-center gap-3", className)} href={href}>
      {source ? (
        <img
          src={source}
          alt="MusicHub"
          onError={() => setSourceIndex((current) => current + 1)}
          className="h-11 w-auto object-contain sm:h-12"
        />
      ) : (
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Music<span className="text-violet-700">Hub</span>
        </span>
      )}
    </Link>
  );
}
