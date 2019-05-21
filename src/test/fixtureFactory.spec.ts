import { expect } from "chai";

import { fixtureFactory, FactoryInstructions } from "./fixtureFactory";

describe("src/test/fixtureFactory", () => {
  it("returns records correctly", () => {
    type ExampleProps = {
      a: string;
      b: number;
      c: string;
    };

    const factoryInstructions: FactoryInstructions<ExampleProps> = {
      a: (i: number) => `A_${i}`,
      b: (i: number) => i,
      c: (i: number) => `C_${i}`,
    };

    const records = fixtureFactory(factoryInstructions, {
      nrOfRecordsToGenerate: 3,
    });

    expect(records.length).to.equal(3);
    expect(records[0]).to.deep.equal({
      a: "A_0",
      b: 0,
      c: "C_0",
    });
    expect(records[1]).to.deep.equal({
      a: "A_1",
      b: 1,
      c: "C_1",
    });
    expect(records[2]).to.deep.equal({
      a: "A_2",
      b: 2,
      c: "C_2",
    });
  });
});
