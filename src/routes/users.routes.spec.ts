import { expect } from "chai";
import request from "supertest";
import User from "../models/user";

import app from "../app";

describe("src/routes/users", () => {
  describe("POST /api/v1/users/login", () => {
    it("401, Auth failed - when wrong email", done => {
      request(app)
        .post("/api/v1/users/login")
        .then(res => {
          const { message } = res.body.error;
          expect(res.status).to.equal(401);
          expect(message).to.equal("Auth failed");
          done();
        })
        .catch(err => done(err));
    });

    it("401, Auth failed - when wrong password", async () => {
      const user = new User({
        email: "test@example.com",
        password: "test_password",
      });
      await user.save();

      try {
        const res = await request(app)
          .post("/api/v1/users/login")
          .send({ email: "test@example.com", password: "wrong_password" });

        const { message } = res.body.error;

        expect(res.status).to.equal(401);
        expect(message).to.equal("Auth failed");
      } catch (err) {
        return err;
      }
    });

    it("200, Token - when email and password are ok", async () => {
      const user = new User({
        email: "test@example.com",
        password: "test_password",
      });
      await user.save();

      try {
        const res = await request(app)
          .post("/api/v1/users/login")
          .send({ email: "test@example.com", password: "test_password" });

        const { token } = res.body;

        expect(res.status).to.equal(200);
        expect(token).to.be.a("string");
      } catch (err) {
        return err;
      }
    });
  });
});
