"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { likeSong, unlikeSong, addFavorite, removeFavorite } from "@/lib/api-engagement";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModules } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

export function EngagementButtons({ songId, initialLikeCount = 0 }: { songId: string, initialLikeCount?: number }) {
  const { accessToken } = useAuth();
  const modules = useModules();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);

  const handleLike = async () => {
    if (!accessToken) return alert("Please log in to like this song.");
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeSong(accessToken ?? undefined, songId);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likeSong(accessToken ?? undefined, songId);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (e: any) {
      alert(e.message || "Could not update like status");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!accessToken) return alert("Please log in to favorite this song.");
    setIsFavLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(accessToken ?? undefined, songId);
        setIsFavorited(false);
      } else {
        await addFavorite(accessToken ?? undefined, songId);
        setIsFavorited(true);
      }
    } catch (e: any) {
      alert(e.message || "Could not update favorite status");
    } finally {
      setIsFavLoading(false);
    }
  };

  const canLike = hasModules(modules, [MODULE_KEYS.userRegistration, MODULE_KEYS.likes]);
  const canFavorite = hasModules(modules, [MODULE_KEYS.userRegistration, MODULE_KEYS.favorites]);
  if (!canLike && !canFavorite) return null;

  return (
    <div className="flex gap-2">
      {canLike ? (
        <button
          onClick={handleLike}
          disabled={isLikeLoading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            isLiked ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </button>
      ) : null}

      {canFavorite ? (
        <button
          onClick={handleFavorite}
          disabled={isFavLoading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            isFavorited ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          <span>{isFavorited ? "Favorited" : "Favorite"}</span>
        </button>
      ) : null}
    </div>
  );
}
