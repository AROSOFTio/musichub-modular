import { SongDetail } from "@/components/catalog/song-detail";

type SongPageProps = {
  params: {
    slug: string;
  };
};

export default function SongPage({ params }: SongPageProps) {
  return <SongDetail slug={params.slug} />;
}
