import request from "supertest";

import User from "../models/user";
import app from "../app";

export const getAuthorizationHeader = async () => {
  const email = "test@email.com";
  const password = "test_PASSW0RD";

  const user = await new User({ email, password }).save();

  const res = await request(app)
    .post("/api/v1/users/login")
    .send({ email, password });

  return {
    authorizationHeader: `Bearer ${res.body.token}`,
    _id: user._id.toString(),
    email,
    password,
  };
};
