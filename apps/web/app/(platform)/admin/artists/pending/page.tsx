import { AdminArtistsTable } from "../page";
export default function PendingArtistsPage() {
  return <AdminArtistsTable verificationStatus="PENDING" title="Pending Verification" description="Artists awaiting verification review." />;
}
