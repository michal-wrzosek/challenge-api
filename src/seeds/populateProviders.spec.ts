import { expect } from "chai";

import Provider from "../models/provider";
import { populateProviders } from "./populateProviders";

describe("seeds/populateProviders", () => {
  it("creates 300 Providers from fixtures", async () => {
    await populateProviders(() => {});
    const count = await Provider.countDocuments();

    expect(count).to.equal(300);
  });
});
