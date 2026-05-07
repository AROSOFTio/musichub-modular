import { Heart, ListMusic, History } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export default function LibraryPage() {
  const libraryLinks = [
    { name: "Favorites", href: "/favorites", icon: Heart, description: "Songs you've favorited" },
    { name: "Playlists", href: "/playlists", icon: ListMusic, description: "Your custom playlists" },
    { name: "Recently Played", href: "/library/history", icon: History, description: "Your listening history" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Library"
        description="Manage your favorites, playlists, and listening history."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {libraryLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="group block rounded-3xl border border-borderSoft bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100 group-hover:text-violet-800">
              <link.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">{link.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

