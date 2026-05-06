"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  adminNote: string | null;
  isReplied: boolean;
  createdAt: string;
};

export default function MessageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [isReplied, setIsReplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!accessToken || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/admin/messages/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data);
        setAdminNote(data.adminNote || "");
        setIsReplied(data.isReplied);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [accessToken, id]);

  const handleSave = async () => {
    if (!accessToken || !id) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/admin/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminNote, isReplied }),
      });

      if (!response.ok) throw new Error("Failed to update message");
      
      router.refresh();
      router.push("/admin/messages");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-64 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />;
  if (!message) return <div>Message not found.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/messages"
        className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to messages
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Message Content */}
          <div className="rounded-4xl border border-borderSoft bg-[var(--card-bg)] p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{message.subject || "No Subject"}</h1>
            <div className="mt-6 whitespace-pre-wrap text-[var(--foreground)] leading-relaxed">
              {message.message}
            </div>
          </div>

          {/* Admin Response/Note */}
          <div className="rounded-4xl border border-borderSoft bg-[var(--card-bg)] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Admin Response / Note</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Use this field to keep track of your response or any internal notes.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Write your response or internal notes here..."
              className="input-shell mt-4 h-48 py-3 resize-none"
            />
            
            <div className="mt-6 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isReplied}
                  onChange={(e) => setIsReplied(e.target.checked)}
                  className="h-5 w-5 rounded border-borderSoft text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-violet-700">
                  Mark as Replied
                </span>
              </label>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="button-primary gap-2"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sender Info */}
          <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6 shadow-sm">
            <h3 className="font-bold text-[var(--foreground)]">Sender Info</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-violet-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Name</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{message.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-violet-600" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Email</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{message.email}</p>
                  <a 
                    href={`mailto:${message.email}`} 
                    className="mt-1 inline-block text-xs font-bold text-violet-600 hover:underline"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-violet-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Received</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={cn(
            "rounded-3xl border p-6 text-center shadow-sm",
            message.isReplied 
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400" 
              : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-400"
          )}>
            {message.isReplied ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-8 w-8 mb-2" />
                <p className="font-bold">Replied</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 mb-2" />
                <p className="font-bold">Waiting for Response</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
