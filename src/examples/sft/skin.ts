import { nftModels } from "../../utils/nftModels";
import { createSft } from "./createSft";

async function run() {
  const skins = [
    "Deadwing",
    "Dipcanned",
    "Shiba Ignine Tailed",
    "God of Thunder",
    "Nekobit",
    "Ragdoll",
    "Rroo",
  ].slice(4);

  for (const name of skins) {
    try {
      const cm = nftModels.skin;
      console.log(name);
      await createSft(name, cm);
    } catch (e) {
      console.error(`Error processing ${name}:`, e);
    }
  }
}

run();
