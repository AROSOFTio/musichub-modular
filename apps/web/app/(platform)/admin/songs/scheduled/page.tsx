import { AdminSongsTable } from "../table";
export default function ScheduledSongsPage() {
  return <AdminSongsTable status="SCHEDULED" title="Scheduled Songs" description="Songs set to publish at a future date." />;
}
