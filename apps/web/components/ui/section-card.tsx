import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  eyebrow,
  children,
  className,
}: SectionCardProps) {
  return (
    <section className={cn("surface-card p-6 sm:p-7", className)}>
      {eyebrow ? <p className="pill">{eyebrow}</p> : null}
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

