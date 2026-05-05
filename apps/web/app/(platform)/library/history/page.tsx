"use client";

import { useEffect, useState } from "react";
import { getPlayHistory } from "@/lib/api-engagement";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { SongList } from "@/components/catalog/song-list";

export default function HistoryPage() {
  const { accessToken } = useAuth();
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    getPlayHistory(accessToken)
      .then((data) => {
        // Map history objects to CatalogSong format
        const mappedSongs = data.map((item) => item.song);
        setSongs(mappedSongs);
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <PageHeader title="Recently Played" description="Your listening history." />
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
      ) : !accessToken ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
          Please log in to view your play history.
        </div>
      ) : songs.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
          You haven't played any songs yet.
        </div>
      ) : (
        <SongList songs={songs} />
      )}
    </div>
  );
}
