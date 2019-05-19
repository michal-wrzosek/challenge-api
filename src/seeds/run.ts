// *
// * This is a small seed cli runnner
// *

import { createMasterUser } from "./createMasterUser";
import { MONGO_DB } from "../configuration/envs";
import { connect, close } from "../db";

run();

async function run() {
  const seeds: { [key: string]: () => Promise<any> } = {
    createMasterUser,
  };

  const seedToRun = process.argv[2];

  if (typeof seedToRun === "undefined") {
    console.log("You need to specify which seed you want to run.");
    listSeeds();
    return;
  }

  if (typeof seeds[seedToRun] !== "function") {
    console.log("There is no such seed to run.");
    listSeeds();
    return;
  }

  try {
    console.log("Connecting to database");
    await connect(MONGO_DB);

    console.log(`Running ${seedToRun} seed`);
    await seeds[seedToRun]();

    console.log("Seed successfully finished.");
  } catch (err) {
    console.log("Error:", err);
  }

  console.log("Closing database connection.");
  close();

  function listSeeds() {
    console.log("Available seeds:");
    Object.keys(seeds).forEach(seedName => console.log(` - ${seedName}`));
  }
}
