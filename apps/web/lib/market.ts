import "server-only";
import { getDashboard } from "./backend";
export async function getRatio() {
  return (await getDashboard()).ratio;
}
