import { expect } from "chai";
import request from "supertest";

import app from "../app";
import { Pagination } from "../lib/pagination";
import Provider, { ProviderProps } from "../models/provider";
import {
  providerFixtures,
  providersFactoryInstructions,
} from "../models/provider.fixtures";
import { fixtureFactory } from "../test/fixtureFactory";
import { US_STATES } from "../types/USStates";

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

    it("400, OK - query validation for page and limit", async () => {
      const res = await request(app).get("/api/v1/providers?page=-1&limit=51");

      expect(res.status).to.equal(400);
      expect(res.body.error.message).to.equal(
        `Bad Request: "page" must be larger than or equal to 1 and "limit" must be less than or equal to 50`
      );
    });

    it("200, OK - max_discharges", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&max_discharges=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges > 50).length).to.equal(
        0
      );
    });

    it("200, OK - min_discharges", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&min_discharges=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges < 50).length).to.equal(
        0
      );
    });

    it("200, OK - max_average_covered_charges", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&max_average_covered_charges=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgCoveredCharges > 50).length).to.equal(
        0
      );
    });

    it("200, OK - min_average_covered_charges", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&min_average_covered_charges=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgCoveredCharges < 50).length).to.equal(
        0
      );
    });

    it("200, OK - max_average_medicare_payments", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&max_average_medicare_payments=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(
        providers.filter((p) => p.avgMedicarePayments > 50).length
      ).to.equal(0);
    });

    it("200, OK - min_average_medicare_payments", async () => {
      await providerFixtures(50);

      const res = await request(app).get(
        "/api/v1/providers?limit=50&min_average_medicare_payments=50"
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(
        providers.filter((p) => p.avgMedicarePayments < 50).length
      ).to.equal(0);
    });

    it("200, OK - state", async () => {
      const records = fixtureFactory(providersFactoryInstructions, {
        nrOfRecordsToGenerate: 50,
      });
      records[0].state = US_STATES["AK"];
      await Provider.insertMany(records);

      const res = await request(app).get(
        `/api/v1/providers?limit=50&state=${US_STATES["AK"]}`
      );
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.state === US_STATES["AK"]).length)
        .to.be.greaterThan(0)
        .and.equal(providers.length);
    });

    it("200, OK - fiters combined", async () => {
      const records = fixtureFactory(providersFactoryInstructions, {
        nrOfRecordsToGenerate: 50,
      });
      records[0].state = US_STATES["AK"];
      await Provider.insertMany(records);

      const query = [
        "limit=50",
        "max_discharges=90",
        "min_discharges=10",
        "max_average_covered_charges=90",
        "min_average_covered_charges=10",
        "max_average_medicare_payments=90",
        "min_average_medicare_payments=10",
        `state=${US_STATES["AK"]}`,
      ].join("&");

      const res = await request(app).get(`/api/v1/providers?${query}`);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges > 90).length).to.equal(
        0
      );
      expect(providers.filter((p) => p.totalDischarges < 10).length).to.equal(
        0
      );
      expect(providers.filter((p) => p.avgCoveredCharges > 90).length).to.equal(
        0
      );
      expect(providers.filter((p) => p.avgCoveredCharges < 10).length).to.equal(
        0
      );
      expect(
        providers.filter((p) => p.avgMedicarePayments > 90).length
      ).to.equal(0);
      expect(
        providers.filter((p) => p.avgMedicarePayments < 10).length
      ).to.equal(0);
      expect(providers.filter((p) => p.state === US_STATES["AK"]).length)
        .to.be.greaterThan(0)
        .and.equal(providers.length);
    });
  });
});
