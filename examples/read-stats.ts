import { Pear } from "@pearos/sdk";
const pear = new Pear({ apiUrl: "https://api.pear2apple.xyz" });
const stats = await pear.getStats();
if (stats.status === "live" && stats.pearsPerApple) {
  console.log(`1 Apple = ${stats.pearsPerApple} Pears`);
}
const activity = await pear.getActivity();
console.log(activity.status, activity.data?.length ?? 0);
