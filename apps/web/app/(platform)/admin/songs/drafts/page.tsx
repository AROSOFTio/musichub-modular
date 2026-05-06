import { AdminSongsTable } from "../table";
export default function DraftSongsPage() {
  return <AdminSongsTable status="DRAFT" title="Draft Songs" description="Songs that are not yet published." />;
}
