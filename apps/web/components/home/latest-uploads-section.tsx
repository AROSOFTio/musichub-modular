"use client";

import Link from "next/link";
import type { CatalogSong } from "@/lib/api";
import { LatestSongRow } from "./song-card";

export function LatestUploadsSection({ songs, mobile = false }: { songs: CatalogSong[]; mobile?: boolean }) {
  if (!songs.length) return null;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">Latest Uploads</h2>
        <Link href="/latest" className="text-sm font-black text-violet-700">See all</Link>
      </div>
      <div className={mobile ? "grid grid-cols-1 gap-3 min-[430px]:grid-cols-2" : "grid gap-3 md:grid-cols-2"}>
        {songs.slice(0, mobile ? 6 : 8).map((song, index) => (
          <LatestSongRow key={song.id} song={song} isNew={index < 2} />
        ))}
      </div>
    </section>
  );
}
