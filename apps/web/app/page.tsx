import { getDashboard } from "@/lib/dashboard";
import { DashboardView } from "@/components/dashboard-view";
export default async function Page() {
  return <DashboardView initial={await getDashboard()} />;
}
