import { PageHeader } from "@/components/ui/page-header";
import { FollowArtistButton } from "@/components/catalog/follow-artist";

export default function ArtistProfilePage({ params }: { params: { slug: string } }) {
  // Normally fetch artist details and their songs from the API
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader title={`Artist: ${params.slug}`} description="Artist profile and songs." />
        <FollowArtistButton artistId="mock-artist-id" />
      </div>
      <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
        Artist songs will appear here.
      </div>
    </div>
  );
}
