"use client";

import { useEffect, useState } from "react";

import { HomeDesktopLayout } from "@/components/home/home-desktop-layout";
import { HomeMobileLayout } from "@/components/home/home-mobile-layout";
import { getHomeFeed, type HomeFeed } from "@/lib/api";

export default function HomePage() {
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHomeFeed()
      .then((payload) => setFeed(payload))
      .catch(() => setFeed(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-7">
        <div className="h-[340px] animate-pulse rounded-[2rem] bg-violet-100" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      </div>
    );
  }

  if (!feed) return null;

  return (
    <div className="pb-20">
      <HomeDesktopLayout feed={feed} />
      <HomeMobileLayout feed={feed} />
    </div>
  );
}
