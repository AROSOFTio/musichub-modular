"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";

import { listSupportTickets, type SupportTicket } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const categories = ["", "ADVERTISE", "SONG_REQUEST", "SONG_REMOVAL", "OTHER"];
const statuses = ["", "NEW", "OPEN", "AWAITING_USER", "RESOLVED", "CLOSED"];

export default function AdminMessagesPage() {
  const { accessToken } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    listSupportTickets(accessToken, { category, status })
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [accessToken, category, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Support Inbox</h1>
        <p className="text-[var(--muted)]">View, filter, assign, reply to, close, and reopen support tickets.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-2 text-sm">
          {categories.map((item) => <option key={item} value={item}>{item || "All categories"}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-2 text-sm">
          {statuses.map((item) => <option key={item} value={item}>{item || "All statuses"}</option>)}
        </select>
      </div>

      {loading ? <div className="h-24 animate-pulse rounded-3xl bg-slate-100" /> : tickets.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-12 text-center text-[var(--muted)]">
          <Inbox className="mx-auto h-12 w-12 opacity-20" />
          <p className="mt-4 font-medium">No tickets found.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/admin/messages/${ticket.id}`} className="flex items-center gap-4 rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5 hover:shadow-md">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-bold text-[var(--foreground)]">#{ticket.ticketNumber} {ticket.subject}</p>
                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-black text-violet-700">{ticket.category}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">{ticket.status}</span>
                </div>
                <p className="truncate text-sm text-[var(--muted)]">{ticket.requesterName} ({ticket.requesterEmail})</p>
              </div>
              <div className="text-right text-xs text-[var(--muted)]">
                {new Date(ticket.createdAt).toLocaleDateString()}
                <ChevronRight className="ml-auto mt-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
