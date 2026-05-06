"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link className={cn("inline-flex items-center gap-3", className)} href={href}>
      {!imgError ? (
        <Image
          src="/brand/musichub-logo.png"
          alt="Musichub"
          width={120}
          height={36}
          priority
          onError={() => setImgError(true)}
          className="h-9 w-auto object-contain"
        />
      ) : (
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Music<span className="text-violet-700">hub</span>
        </span>
      )}
    </Link>
  );
}
