"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, User, Shield, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createAdminUser } from "@/lib/api";

export default function NewUserPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    username: "",
    password: "",
    role: "USER" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createAdminUser(accessToken ?? undefined, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[var(--foreground)]">User Created!</h2>
          <p className="mt-2 text-[var(--muted)]">Redirecting to user list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Add New User</h1>
        <p className="mt-2 text-[var(--muted)]">Create a new account with specific roles and permissions.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[2.5rem] border border-borderSoft bg-[var(--card-bg)] p-8 shadow-xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Display Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full rounded-2xl border border-borderSoft bg-[var(--surface)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Username (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                className="w-full rounded-2xl border border-borderSoft bg-[var(--surface)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full rounded-2xl border border-borderSoft bg-[var(--surface)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Password</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-borderSoft bg-[var(--surface)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
            />
          </div>
          <p className="text-[10px] text-[var(--muted)]">Minimum 8 characters with a mix of letters and numbers.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">System Role</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(["USER", "ARTIST", "EDITOR", "ADMIN"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border p-4 transition-all",
                  formData.role === role
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20 dark:bg-violet-900/20"
                    : "border-borderSoft bg-[var(--surface)] text-[var(--muted)] hover:border-violet-300"
                )}
              >
                <Shield className={cn("h-5 w-5 mb-2", formData.role === role ? "text-violet-600" : "text-slate-400")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{role}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-violet-700 disabled:opacity-50"
          >
            {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <UserPlus className="h-5 w-5" />}
            CREATE USER ACCOUNT
          </button>
        </div>
      </form>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
