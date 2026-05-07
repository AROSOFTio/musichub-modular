import type { CatalogArtist, CatalogSong } from "@/lib/api";

export function formatArtistNames(primary: CatalogArtist, featuredArtists?: CatalogArtist[]) {
  const featuredNames = (featuredArtists ?? [])
    .map((artist) => artist.name)
    .filter(Boolean);

  return featuredNames.length
    ? `${primary.name} feat. ${featuredNames.join(", ")}`
    : primary.name;
}

export function formatSongArtists(song: CatalogSong) {
  return formatArtistNames(song.artist, song.featuredArtists);
}
