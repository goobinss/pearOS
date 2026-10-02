import "server-only";
import { getDashboard } from "./backend";
export async function getTreasury() {
  return (await getDashboard()).treasury;
}
