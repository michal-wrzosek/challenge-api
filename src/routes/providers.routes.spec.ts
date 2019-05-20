import { expect } from "chai";
import request from "supertest";

import app from "../app";
import { Pagination } from "../lib/pagination";
import Provider, { ProviderProps } from "../models/provider";
import { providerFixtures } from "../models/provider.fixtures";

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

    it("200, OK - default", async () => {
      const createdProviders = await providerFixtures(100);

      const res = await request(app).get("/api/v1/providers");
      const {
        data: { providers },
        pagination,
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");
      expect(providers.length).to.equal(10);
      expect(pagination.page).to.equal(1);
      expect(pagination.limit).to.equal(10);
      expect(pagination.totalDocs).to.equal(100);
      expect(pagination.totalPages).to.equal(10);
      expect(pagination.prevPage).to.equal(null);
      expect(pagination.nextPage).to.equal(2);

      const returnedExampleProvider = providers[0];
      const createdExampleProvider = Provider.serialize(
        createdProviders.find(
          (p) => p.providerId === returnedExampleProvider.providerId
        )
      );
      expect(returnedExampleProvider).to.deep.equal(createdExampleProvider);
    });

    it("200, OK - pagination, default use", async () => {
      await providerFixtures(30);

      const res = await request(app).get("/api/v1/providers?page=2&limit=5");
      const {
        data: { providers },
        pagination,
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");
      expect(providers.length).to.equal(5);
      expect(pagination.page).to.equal(2);
      expect(pagination.limit).to.equal(5);
      expect(pagination.totalDocs).to.equal(30);
      expect(pagination.totalPages).to.equal(6);
      expect(pagination.prevPage).to.equal(1);
      expect(pagination.nextPage).to.equal(3);
    });

    it("200, OK - pagination, min page and max limit", async () => {
      await providerFixtures(60);

      const res = await request(app).get("/api/v1/providers?page=-1&limit=100");
      const {
        data: { providers },
        pagination,
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");
      expect(providers.length).to.equal(50);
      expect(pagination.page).to.equal(1);
      expect(pagination.limit).to.equal(50);
      expect(pagination.totalDocs).to.equal(60);
      expect(pagination.totalPages).to.equal(2);
      expect(pagination.prevPage).to.equal(null);
      expect(pagination.nextPage).to.equal(2);
    });
  });
});
