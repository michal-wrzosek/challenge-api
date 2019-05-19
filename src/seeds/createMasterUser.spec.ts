import { expect } from "chai";

import User from "../models/user";
import { MASTER_USER_EMAIL } from "../configuration/envs";
import { createMasterUser } from "./createMasterUser";

describe("seeds/createMasterUser", () => {
  it("creates a new user", async () => {
    await createMasterUser();
    const user = await User.findOne({ email: MASTER_USER_EMAIL }).exec();

    expect(!!user).to.equal(true);
  });
});
