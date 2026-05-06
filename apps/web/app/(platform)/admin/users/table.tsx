"use client";

import { useEffect, useState } from "react";
import { User, Trash2, ShieldAlert } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminUser, deleteAdminUser, listAdminUsers, updateAdminUserRole } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function AdminUsersTable() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(token: string) {
    setLoading(true);
    try {
      const data = await listAdminUsers(token);
      setUsers(data); setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally { setLoading(false); }
  }

  useEffect(() => { if (accessToken) void load(accessToken); }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminUser(accessToken, id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleRoleChange(id: string, newRole: string) {
    if (!accessToken) return;
    const updated = await updateAdminUserRole(accessToken, id, newRole);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Manage platform users, artists, and admins."
        breadcrumb={[{ label: "Admin" }, { label: "Users" }]}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : users.length === 0 ? (
        <AdminEmptyState icon={User} title="No users found" description="No users are registered on the platform." action={<div />} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Songs</th>
                <th className="px-4 py-3 text-right">Playlists</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
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
                        onChange={(e) => void handleRoleChange(user.id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-violet-400"
                      >
                        <option value="USER">User</option>
                        <option value="ARTIST">Artist</option>
                        <option value="ADMIN">Admin</option>
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
