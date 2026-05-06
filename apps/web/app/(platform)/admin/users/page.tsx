"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserPlus, Mail, Shield, Trash2, MoreVertical, Search, Filter } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listAdminUsers, deleteAdminUser, type AdminUser } from "@/lib/api";

export default function UsersListPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await listAdminUsers(accessToken ?? undefined);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteAdminUser(accessToken ?? undefined, id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">User Management</h1>
          <p className="mt-2 text-[var(--muted)]">Manage accounts, roles, and platform permissions.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg transition-transform hover:scale-105"
        >
          <UserPlus className="h-5 w-5" />
          ADD USER
        </Link>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-borderSoft bg-[var(--card-bg)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="flex h-11 items-center gap-2 rounded-2xl border border-borderSoft bg-[var(--card-bg)] px-4 text-sm font-bold text-[var(--muted)] hover:border-violet-300 transition-all">
             <Filter className="h-4 w-4" /> All Roles
           </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-borderSoft bg-[var(--card-bg)] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-borderSoft bg-slate-50/50 dark:bg-slate-900/20">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">User</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Role</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Stats</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSoft">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 rounded-lg bg-slate-100 dark:bg-slate-800" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-32 rounded-lg bg-slate-100 dark:bg-slate-800" /></td>
                    <td className="px-6 py-4 text-right"><div className="ml-auto h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-900/30">
                          {user.displayName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[var(--foreground)]">{user.displayName}</p>
                          <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                        user.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900/20" :
                        user.role === "EDITOR" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20" :
                        user.role === "ARTIST" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20" :
                        "bg-slate-100 text-slate-700 dark:bg-slate-800"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      <div className="flex items-center gap-4">
                         <span className="flex items-center gap-1"><b>{user._count.songs}</b> Songs</span>
                         <span className="flex items-center gap-1"><b>{user._count.playlists}</b> Playlists</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100 dark:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 dark:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-[var(--muted)]">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
