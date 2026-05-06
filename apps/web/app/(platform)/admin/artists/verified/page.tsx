import { AdminArtistsTable } from "../table";
export default function VerifiedArtistsPage() {
  return <AdminArtistsTable verificationStatus="VERIFIED" title="Verified Artists" description="Artists with verified status." />;
}
