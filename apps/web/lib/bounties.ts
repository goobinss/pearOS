import "server-only";
import { getDashboard } from "./backend";
export async function getBounties() {
  return (await getDashboard()).bounties;
}
