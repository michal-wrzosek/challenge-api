import { expect } from "chai";

import { isSet } from "./isSet";

describe("lib/isSet", () => {
  it("returns true if set", () => {
    expect(isSet(true)).to.be.equal(true);
    expect(isSet("string")).to.be.equal(true);
    expect(isSet([])).to.be.equal(true);
    expect(isSet({})).to.be.equal(true);
    expect(isSet(0)).to.be.equal(true);
    expect(isSet("")).to.be.equal(true);
    expect(isSet(null)).to.be.equal(true);
  });

  it("returns false if not set", () => {
    expect(isSet()).to.be.equal(false);
    expect(isSet(undefined)).to.be.equal(false);
  });
});
