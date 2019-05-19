import { expect } from "chai";
import request from "supertest";

import app from "./app";

describe("src/app", () => {
  describe("Not Found response", () => {
    it("Returns 404", done => {
      request(app)
        .get("/not_existing_endpoint")
        .then(res => {
          const {
            error: { message },
          } = res.body;
          expect(message).to.be.equal("Not found");
          expect(res.status).to.be.equal(404);
          done();
        })
        .catch(err => done(err));
    });
  });
});
