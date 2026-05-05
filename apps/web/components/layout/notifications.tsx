"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getNotifications, markNotificationRead, Notification } from "@/lib/api-engagement";

export function NotificationsDropdown() {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (accessToken) {
      loadNotifications();
    }
  }, [accessToken]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(accessToken ?? undefined);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRead = async (id: string) => {
    try {
      await markNotificationRead(accessToken ?? undefined, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!accessToken) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-borderSoft bg-white text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-borderSoft bg-white shadow-card z-50 overflow-hidden">
          <div className="border-b border-borderSoft p-4">
            <h3 className="font-semibold text-slate-950">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No new notifications.</div>
            ) : (
              <div className="divide-y divide-borderSoft">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors ${
                      n.isRead ? "bg-white opacity-60" : "bg-violet-50/50"
                    }`}
                    onClick={() => !n.isRead && handleRead(n.id)}
                  >
                    <p className="text-sm font-medium text-slate-950">{n.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                    {n.link && (
                      <Link href={n.link} className="mt-2 inline-block text-xs font-semibold text-violet-700 hover:text-violet-800">
                        View Details
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
