import { AdminSongsTable } from "../table";
export default function ReportedSongsPage() {
  return <AdminSongsTable status="REPORTED" title="Reported Songs" description="Songs flagged by users for review." />;
}
