import { nftModels } from "../../utils/nftModels";
import { createSft } from "./createSft";

async function run() {
  try {
    // ### EDIT START ###
    const name = "JUP Launch";
    const cm = nftModels.collectible;
    // ### EDIT END ###

    await createSft(name, cm);
  } catch (e) {
    console.error(e);
  }
}

run();
