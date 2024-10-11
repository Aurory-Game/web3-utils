import { nftModels } from "../../utils/nftModels";
import { generateMetadata } from "./generateMetadata";

async function run() {
  const cm = nftModels.skin;
  const skins = [
    {
      name: "Deadwing",
      loreDescription: "Haunt the Halloween sky.",
      nefty: "Ghouliath",
    },
    {
      name: "Dipcanned",
      loreDescription: "No opener required.",
      nefty: "Dipking",
    },
    {
      name: "Shiba Ignine Tailed",
      loreDescription: "Light up your journey.",
      nefty: "Shiba Ignite",
    },
    {
      name: "God of Thunder",
      loreDescription: "Ready to ride the storm.",
      nefty: "Dracurve",
    },
    {
      name: "Nekobit",
      loreDescription: "Fortune favors the gold.",
      nefty: "Bitebit",
    },
    {
      name: "Ragdoll",
      loreDescription: "Patched up with love.",
      nefty: "Unika",
    },
    {
      name: "Rroo",
      loreDescription: "You’ll fit right in.",
      nefty: "Zzoo",
    },
  ];

  for (const skin of skins) {
    const { name, loreDescription } = skin;
    const attributes = cm.attributes(name);
    await generateMetadata(cm, name, loreDescription, attributes);
  }
}

run();
