import { expect } from "chai";
import request from "supertest";

import app from "../app";
import { Pagination } from "../lib/pagination";
import Provider, { ProviderProps } from "../models/provider";
import { providerFixtures, providersFactoryInstructions } from "../models/provider.fixtures";
import { fixtureFactory } from "../test/fixtureFactory";
import { US_STATES } from "../types/USStates";
import User from "../models/user";

const getAuthorizationHeader = async () => {
  const email = "test@email.com";
  const password = "test_PASSW0RD";

  await new User({ email, password }).save();

  const res = await request(app)
    .post("/api/v1/users/login")
    .send({ email, password });

  return `Bearer ${res.body.token}`;
};

describe("src/routes/providers", () => {
  describe("GET /api/v1/providers", () => {
    it("401, OK - Auth failed when accessing without token", async () => {
      const res = await request(app).get("/api/v1/providers");

      expect(res.status).to.equal(401);
      expect(res.body.error.message).to.equal(`Auth failed`);
    });

    it("200, OK - default, empty db", async () => {
      const authorizationHeader = await getAuthorizationHeader();

      const res = await request(app)
        .get("/api/v1/providers")
        .set("Authorization", authorizationHeader);

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
    });

    it("200, OK - default", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      const createdProviders = await providerFixtures(100);

      const res = await request(app)
        .get("/api/v1/providers")
        .set("Authorization", authorizationHeader);
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
        createdProviders.find((p) => p.providerId === returnedExampleProvider.providerId)
      );
      expect(returnedExampleProvider).to.deep.equal(createdExampleProvider);
    });

    it("200, OK - pagination, default use", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(30);

      const res = await request(app)
        .get("/api/v1/providers?page=2&limit=5")
        .set("Authorization", authorizationHeader);
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
      const authorizationHeader = await getAuthorizationHeader();
      const res = await request(app)
        .get("/api/v1/providers?page=-1&limit=51")
        .set("Authorization", authorizationHeader);

      expect(res.status).to.equal(400);
      expect(res.body.error.message).to.equal(
        `Bad Request: "page" must be larger than or equal to 1 and "limit" must be less than or equal to 50`
      );
    });

    it("200, OK - max_discharges", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&max_discharges=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges > 50).length).to.equal(0);
    });

    it("200, OK - min_discharges", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&min_discharges=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges < 50).length).to.equal(0);
    });

    it("200, OK - max_average_covered_charges", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&max_average_covered_charges=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgCoveredCharges > 50).length).to.equal(0);
    });

    it("200, OK - min_average_covered_charges", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&min_average_covered_charges=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgCoveredCharges < 50).length).to.equal(0);
    });

    it("200, OK - max_average_medicare_payments", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&max_average_medicare_payments=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgMedicarePayments > 50).length).to.equal(0);
    });

    it("200, OK - min_average_medicare_payments", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(50);

      const res = await request(app)
        .get("/api/v1/providers?limit=50&min_average_medicare_payments=50")
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.avgMedicarePayments < 50).length).to.equal(0);
    });

    it("200, OK - state", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      const records = fixtureFactory(providersFactoryInstructions, {
        nrOfRecordsToGenerate: 50,
      });
      records[0].state = US_STATES["AK"];
      await Provider.insertMany(records);

      const res = await request(app)
        .get(`/api/v1/providers?limit=50&state=${US_STATES["AK"]}`)
        .set("Authorization", authorizationHeader);
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
      const authorizationHeader = await getAuthorizationHeader();
      const records = fixtureFactory(providersFactoryInstructions, {
        nrOfRecordsToGenerate: 50,
      });
      records[0].totalDischarges = 50;
      records[0].avgCoveredCharges = 50;
      records[0].avgMedicarePayments = 50;
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

      const res = await request(app)
        .get(`/api/v1/providers?${query}`)
        .set("Authorization", authorizationHeader);
      const {
        data: { providers },
      } = res.body as {
        data: { providers: ProviderProps[] };
        pagination: Pagination;
      };

      expect(res.status).to.equal(200);
      expect(providers).to.be.an("array");

      expect(providers.filter((p) => p.totalDischarges > 90).length).to.equal(0);
      expect(providers.filter((p) => p.totalDischarges < 10).length).to.equal(0);
      expect(providers.filter((p) => p.avgCoveredCharges > 90).length).to.equal(0);
      expect(providers.filter((p) => p.avgCoveredCharges < 10).length).to.equal(0);
      expect(providers.filter((p) => p.avgMedicarePayments > 90).length).to.equal(0);
      expect(providers.filter((p) => p.avgMedicarePayments < 10).length).to.equal(0);
      expect(providers.filter((p) => p.state === US_STATES["AK"]).length)
        .to.be.greaterThan(0)
        .and.equal(providers.length);
    });

    it("200, OK - select one field", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(10);

      const res = await request(app)
        .get("/api/v1/providers?project=name")
        .set("Authorization", authorizationHeader);
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
      expect(pagination.totalDocs).to.equal(10);
      expect(pagination.totalPages).to.equal(1);
      expect(pagination.prevPage).to.equal(null);
      expect(pagination.nextPage).to.equal(null);

      const returnedExampleProvider = providers[0];
      expect(Object.keys(returnedExampleProvider)).to.eql(["_id", "name"]);
    });

    it("200, OK - select multiple fields", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(10);

      const query = [
        "project=name",
        "project=hospitalReferralRegionDesc",
        "project=avgCoveredCharges",
        "project=avgMedicarePayments",
      ].join("&");

      const res = await request(app)
        .get(`/api/v1/providers?${query}`)
        .set("Authorization", authorizationHeader);
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
      expect(pagination.totalDocs).to.equal(10);
      expect(pagination.totalPages).to.equal(1);
      expect(pagination.prevPage).to.equal(null);
      expect(pagination.nextPage).to.equal(null);

      const returnedExampleProvider = providers[0];
      expect(Object.keys(returnedExampleProvider)).to.eql([
        "_id",
        "name",
        "hospitalReferralRegionDesc",
        "avgCoveredCharges",
        "avgMedicarePayments",
      ]);
    });

    it("400, OK - when select wrong field", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(10);

      const res = await request(app)
        .get(`/api/v1/providers?project=wrongField`)
        .set("Authorization", authorizationHeader);
      const {
        error: { message },
      } = res.body;

      expect(res.status).to.equal(400);
      expect(message).to.equal(
        `Bad Request: "project" must be one of [providerId, name, street, city, state, zipcode, hospitalReferralRegionDesc, totalDischarges, avgCoveredCharges, avgTotalPayments, avgMedicarePayments, drgDefinition] and "project" must be an array`
      );
    });

    it("400, OK - when select wrong fields", async () => {
      const authorizationHeader = await getAuthorizationHeader();
      await providerFixtures(10);

      const query = [
        "project=name",
        "project=hospitalReferralRegionDesc",
        "project=avgCoveredCharges",
        "project=notExistingOne",
      ].join("&");

      const res = await request(app)
        .get(`/api/v1/providers?${query}`)
        .set("Authorization", authorizationHeader);
      const {
        error: { message },
      } = res.body;

      expect(res.status).to.equal(400);
      expect(message).to.equal(
        `Bad Request: "project" must be a string and "3" must be one of [providerId, name, street, city, state, zipcode, hospitalReferralRegionDesc, totalDischarges, avgCoveredCharges, avgTotalPayments, avgMedicarePayments, drgDefinition]`
      );
    });
  });
});
