import { nftModels, Rarity } from "../../utils/nftModels";
import { generateMetadata } from "./generateMetadata";

async function run() {
  const cm = nftModels.collectible;
  // ### EDIT START ###
  const name = "Going To Space";
  const description =
    "A special collectible from Aurory Project to recognize our brave $JUP Space Catdets";
  const rarity = Rarity.COMMON;
  const releaseDate = "01/24"; // MM/YY
  // ### EDIT END ###

  const attributes = cm.attributes(releaseDate, rarity);
  await generateMetadata(cm, name, description, attributes);
}

run();
