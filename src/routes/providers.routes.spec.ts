import { expect } from "chai";
import request from "supertest";

import app from "../app";
import { Pagination } from "src/lib/pagination";
import { ProviderProps } from "src/models/provider";

describe("src/routes/providers", () => {
  describe("GET /api/v1/providers", () => {
    it("200, OK - default, empty db", (done) => {
      request(app)
        .get("/api/v1/providers")
        .then((res) => {
          const {
            data: { providers },
            pagination,
          } = res.body as {
            data: { providers: ProviderProps[] };
            pagination: Pagination;
          };
          expect(res.status).to.equal(200);
          expect(providers).to.be.an("array");
          expect(providers.length).to.equal(0);
          expect(pagination.page).to.equal(1);
          expect(pagination.limit).to.equal(10);
          expect(pagination.totalDocs).to.equal(0);
          expect(pagination.totalPages).to.equal(1);
          expect(pagination.prevPage).to.equal(null);
          expect(pagination.nextPage).to.equal(null);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
