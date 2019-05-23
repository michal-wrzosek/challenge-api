import { expect } from "chai";
import request from "supertest";
import User from "../models/user";

import app from "../app";
import { getAuthorizationHeader } from "../test/getAuthorizationHeader";

describe("src/routes/users", () => {
  describe("POST /api/v1/users/login", () => {
    it("401, OK - Auth failed - when wrong email", async () => {
      const res = await request(app).post("/api/v1/users/login");
      const { message } = res.body.error;
      expect(res.status).to.equal(401);
      expect(message).to.equal("Auth failed");
    });

    it("401, OK - Auth failed - when wrong password", async () => {
      const user = new User({
        email: "test@example.com",
        password: "test_password",
      });
      await user.save();

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({ email: "test@example.com", password: "wrong_password" });

      const { message } = res.body.error;

      expect(res.status).to.equal(401);
      expect(message).to.equal("Auth failed");
    });

    it("200, OK - Token - when email and password are ok", async () => {
      const user = new User({
        email: "test@example.com",
        password: "test_password",
      });
      await user.save();

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({ email: "test@example.com", password: "test_password" });

      const { token } = res.body;

      expect(res.status).to.equal(200);
      expect(token).to.be.a("string");
    });
  });

  describe("GET /api/v1/users/me", () => {
    it("401, OK - Auth failed - when invalid token", async () => {
      const res = await request(app).post("/api/v1/users/me");

      const { message } = res.body.error;
      expect(res.status).to.equal(401);
      expect(message).to.equal("Auth failed");
    });

    it("200, OK - receive data of currently logged in user", async () => {
      const { authorizationHeader, _id, email } = await getAuthorizationHeader();

      const res = await request(app)
        .post("/api/v1/users/me")
        .set("Authorization", authorizationHeader);

      const { _id: responseId, email: responseEmail } = res.body.user;
      expect(res.status).to.equal(200);
      expect(responseId).to.equal(_id);
      expect(responseEmail).to.equal(email);
    });
  });
});
