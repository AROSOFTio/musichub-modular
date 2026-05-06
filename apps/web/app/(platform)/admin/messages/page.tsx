"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isReplied: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/admin/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Support Messages</h1>
        <p className="text-[var(--muted)]">Manage inquiries and feedback from users.</p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-12 text-center text-[var(--muted)]">
            <Mail className="mx-auto h-12 w-12 opacity-20" />
            <p className="mt-4 font-medium">No messages found.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Link
              key={msg.id}
              href={`/admin/messages/${msg.id}`}
              className="flex items-center gap-4 rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5 transition-all hover:shadow-md dark:hover:bg-slate-900/50"
            >
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                msg.isReplied ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
              )}>
                {msg.isReplied ? <CheckCircle className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[var(--foreground)] truncate">{msg.subject || "No Subject"}</p>
                  {!msg.isReplied && (
                    <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted)] truncate">
                  From: <span className="font-medium text-[var(--foreground)]">{msg.name}</span> ({msg.email})
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
                <ChevronRight className="ml-auto mt-1 h-4 w-4 text-[var(--muted)]" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
