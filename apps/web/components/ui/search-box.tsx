"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      router.push("/search");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="input-shell pl-11"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={pathname === "/search" ? "Search tracks, artists, genres" : "Search Musichub"}
        type="search"
        value={query}
      />
    </form>
  );
}
