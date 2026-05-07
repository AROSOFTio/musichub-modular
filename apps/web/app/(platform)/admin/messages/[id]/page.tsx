"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { assignSupportTicket, listSupportAssignees, replySupportTicket, updateSupportTicketStatus, getSupportTicket, type SupportTicket } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const statuses = ["NEW", "OPEN", "AWAITING_USER", "RESOLVED", "CLOSED"];

export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [assignees, setAssignees] = useState<Array<{ id: string; displayName: string; email: string; role: string }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken || !id) return;
    getSupportTicket(accessToken, id).then(setTicket).catch(() => setTicket(null));
    listSupportAssignees(accessToken).then(setAssignees).catch(() => setAssignees([]));
  }, [accessToken, id]);

  async function sendReply() {
    if (!accessToken || !ticket || !reply.trim()) return;
    setSaving(true);
    try {
      const updated = await replySupportTicket(accessToken, ticket.id, reply);
      setTicket(updated);
      setReply("");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: string) {
    if (!accessToken || !ticket) return;
    setTicket(await updateSupportTicketStatus(accessToken, ticket.id, status));
  }

  async function changeAssignee(assignedToId: string) {
    if (!accessToken || !ticket) return;
    setTicket(await assignSupportTicket(accessToken, ticket.id, assignedToId || null));
  }

  if (!ticket) return <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/admin/messages" className="flex items-center gap-2 text-sm font-medium text-violet-600">
        <ArrowLeft className="h-4 w-4" /> Back to inbox
      </Link>
      <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">#{ticket.ticketNumber} {ticket.subject}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{ticket.requesterName} ({ticket.requesterEmail})</p>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Email: {ticket.emailDeliveryStatus}</p>
          </div>
          <select value={ticket.status} onChange={(event) => void changeStatus(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-2 text-sm">
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={ticket.assignedToId ?? ""} onChange={(event) => void changeAssignee(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-2 text-sm">
            <option value="">Unassigned</option>
            {assignees.map((user) => <option key={user.id} value={user.id}>{user.displayName}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {ticket.messages?.map((message) => (
          <div key={message.id} className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5">
            <div className="mb-3 flex justify-between gap-3 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              <span>{message.authorType} - {message.authorName}</span>
              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{message.body}</p>
            {message.attachments?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {message.attachments.map((attachment) => <span key={attachment.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs">{attachment.filename}</span>)}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5">
        <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={5} className="input-shell h-auto py-3" placeholder="Reply to requester..." />
        <button disabled={saving || !reply.trim()} onClick={sendReply} className="button-primary mt-4 gap-2">
          <Send className="h-4 w-4" /> Send Reply
        </button>
      </div>
    </div>
  );
}
