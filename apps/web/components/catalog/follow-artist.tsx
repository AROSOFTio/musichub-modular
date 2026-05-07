"use client";

import { useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { followArtist, unfollowArtist } from "@/lib/api-engagement";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModules } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

export function FollowArtistButton({ artistId }: { artistId: string }) {
  const { accessToken } = useAuth();
  const modules = useModules();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!accessToken) return alert("Please log in to follow this artist.");
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowArtist(accessToken ?? undefined, artistId);
        setIsFollowing(false);
      } else {
        await followArtist(accessToken ?? undefined, artistId);
        setIsFollowing(true);
      }
    } catch (e: any) {
      alert(e.message || "Failed to follow artist");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasModules(modules, [MODULE_KEYS.artistRegistration, MODULE_KEYS.follows])) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isFollowing
          ? "border border-borderSoft bg-surface text-slate-700 hover:bg-slate-100"
          : "bg-violet-600 text-white hover:bg-violet-700"
      }`}
    >
      {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
