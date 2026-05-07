"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { User, Trash2, ShieldAlert, UserPlus, Search, Filter } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminUser, deleteAdminUser, listAdminUsers, updateAdminUserRole } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types/user-role";

export function AdminUsersTable() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function load(token: string) {
    setLoading(true);
    try {
      const data = await listAdminUsers(token);
      setUsers(data); 
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally { setLoading(false); }
  }

  useEffect(() => { if (accessToken) void load(accessToken); }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    try {
      await deleteAdminUser(accessToken, id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  }

  async function handleRoleChange(id: string, newRole: UserRole) {
    if (!accessToken) return;
    try {
      const updated = await updateAdminUserRole(accessToken, id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      alert("Failed to update role.");
    }
  }

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          title="User Management"
          description="Manage platform users, artists, editors, and admins."
          breadcrumb={[{ label: "Admin" }, { label: "Users" }]}
        />
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
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-500 hover:border-violet-300 transition-all">
             <Filter className="h-4 w-4" /> All Roles
           </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : filteredUsers.length === 0 ? (
        <AdminEmptyState icon={User} title="No users found" description="No users match your criteria." action={<div />} />
      ) : (
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Songs</th>
                <th className="px-6 py-4 text-right">Playlists</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
                        {user.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{user._count.songs}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{user._count.playlists}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => void handleRoleChange(user.id, e.target.value as UserRole)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-violet-400"
                      >
                        <option value="USER">User</option>
                        <option value="ARTIST">Artist</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DEV_ADMIN">Dev Admin</option>
                      </select>
                      <ConfirmDeleteDialog
                        title="Delete user"
                        description={`Delete user "${user.displayName}"? This will remove all their data permanently.`}
                        onConfirm={() => handleDelete(user.id)}
                        trigger={(open) => (
                          <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
