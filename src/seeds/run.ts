// *
// * This is a small seed cli runnner
// *

import { createMasterUser } from "./createMasterUser";
import { MONGODB_URI } from "../configuration/envs";
import { connect, close } from "../db";

async function run() {
  const seeds: { [key: string]: () => Promise<void> } = {
    createMasterUser,
  };

  function listSeeds() {
    console.log("Available seeds:");
    Object.keys(seeds).forEach((seedName) => console.log(` - ${seedName}`));
  }

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
    await connect(MONGODB_URI);

    console.log(`Running ${seedToRun} seed`);
    await seeds[seedToRun]();

    console.log("Seed successfully finished.");
  } catch (err) {
    console.log("Error:", err);
  }

  console.log("Closing database connection.");
  close();
}

run();
