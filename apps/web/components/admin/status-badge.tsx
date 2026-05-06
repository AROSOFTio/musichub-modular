import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_MAP: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-slate-50 text-slate-600 border-slate-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  DISABLED: "bg-red-50 text-red-700 border-red-200",
  REPORTED: "bg-amber-50 text-amber-700 border-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNVERIFIED: "bg-slate-50 text-slate-500 border-slate-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-slate-50 text-slate-500 border-slate-200",
  MOOD: "bg-pink-50 text-pink-700 border-pink-200",
  PURPOSE: "bg-blue-50 text-blue-700 border-blue-200",
  STYLE: "bg-purple-50 text-purple-700 border-purple-200",
  AUDIENCE: "bg-orange-50 text-orange-700 border-orange-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const classes = STATUS_MAP[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        classes,
        className
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
    </span>
  );
}
