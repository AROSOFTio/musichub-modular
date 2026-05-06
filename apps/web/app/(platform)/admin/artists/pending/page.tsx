import { AdminArtistsTable } from "../table";
export default function PendingArtistsPage() {
  return <AdminArtistsTable verificationStatus="PENDING" title="Pending Verification" description="Artists awaiting verification review." />;
}
