import { nftModels } from "../../utils/nftModels";
import { createSft } from "./createSft";

async function run() {
  try {
    // ### EDIT START ###
    const name = "Draconic Egg";
    const cm = nftModels.egg;
    // ### EDIT END ###

    await createSft(name, cm);
  } catch (e) {
    console.error(e);
  }
}

run();
