import { providerFixtures } from "../models/provider.fixtures";

// *
// * Populate Providers with fixtures
// *

export async function populateProviders(consoleLog: (...args: any[]) => void) {
  consoleLog("Populating Providers with fixtures...");

  await providerFixtures(300);

  consoleLog("Providers populated succesfully successfully");
}
