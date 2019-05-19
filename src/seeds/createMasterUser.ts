// *
// * Creates master user based on specified ENVs
// *

import User, { IUser } from "../models/user";
import { MASTER_USER_EMAIL, MASTER_USER_PASSWORD } from "../configuration/envs";

export async function createMasterUser() {
  console.log("Creating new master user...");

  const props: IUser = {
    email: MASTER_USER_EMAIL,
    password: MASTER_USER_PASSWORD,
  };

  const user = new User(props);

  await user.save();
  console.log("Master user created successfully");
}
