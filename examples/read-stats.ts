import { Pear } from "@pearos/sdk";
const pear = new Pear({ apiUrl: "http://localhost:3000" });
const comparison = await pear.getRatio();
console.log(comparison.mode, comparison.status, comparison.ratio);
