# Challenge API - REST API

It's a demo API. There is also a [Demo App](https://github.com/michal-wrzosek/challenge-app) using this API.

---

# Documentation

- [Environments](#environments)
- [Authentication](#authentication)
- [Error responses](#error-responses)
- [Routes](#routes):
  - [Providers](#providers)
  - [Users](#users)
- [Architecture Design](#architecture-design)
- [Development](#development)
  - [Seeds](#seeds)

## Environments

**Production:**
https://challenge-api-production.herokuapp.com/

**Staging:**
https://challenge-api-staging.herokuapp.com/

## Authentication

Access to some endpoints is limited. In order to gain access to them you'll need a valid JSON Web Token. This token can be obtained by calling [/api/v1/users/login](#post-userslogin) endpoint. Token is active for 1 hour. When calling protected endpoints you need to attach an Autorization header with your token like this:

```
Header["Authorization"]: "Bearer your_token_here"
```

## Error responses

All errors responses are always structured in the same way:

```
Status: 401, 404, 500

JSON:
- error:
  - message: string
```

## Routes

### Providers

This route lets you query "Providers" resource.

#### GET /providers

This endpoint let's you receive a list of Providers. This endpoint needs a valid token to be accessed (Read more: [Authentication](#authentication))

```
GET /api/v1/providers
```

**Pagination:**
This endpoint is paginated. 10 records per page by default. (Min 1, max 50)

**Filters:**
You can filter results. Check "Parameters" section.

**Projection:**
You can select which fields should be returned. All are visible by default. Check "Parameters" section.

**Parameters:**

```
Filters query params:
- max_discharges: number
  - min: 0
  - filters totalDischarges column
- min_discharges: number
  - min: 0
  - filters totalDischarges column
- max_average_covered_charges: number
  - min: 0
  - filters avgCoveredCharges column
- min_average_covered_charges: number
  - min: 0
  - filters avgCoveredCharges column
- max_average_medicare_payments: number
  - min: 0
  - filters avgMedicarePayments column
- min_average_medicare_payments: number
  - min: 0
  - filters avgMedicarePayments column
- state: string (ISO 3166-2 Code like "DC")
  - filters state column

Projection query params:
- project: string
  - one of:
    - providerId
    - name
    - street
    - city
    - state
    - zipcode
    - hospitalReferralRegionDesc
    - totalDischarges
    - avgCoveredCharges
    - avgTotalPayments
    - avgMedicarePayments
    - drgDefinition
  - when using this param you can control which field should be returned
  - you can project multiple columns like this:
    - /api/v1/providers?project=name&project=street
    - this will return only "_id", "name" and "street" fields
  - "_id" field will always be returned

Pagination query params:
- page: number (positive integer to select current page)
- limit: number (integer in range 1 - 50 to select certain nr of records per page)
```

**Successful response:**

```
Status: 200

JSON:
- data:
  - providers: [
    - _id: string
    - providerId: string
    - name: string
    - street: string
    - city: string
    - state: string
    - zipcode: string
    - hospitalReferralRegionDesc: string
    - totalDischarges: number
    - avgCoveredCharges: number
    - avgTotalPayments: number
    - avgMedicarePayments: number
    - drgDefinition: string
  ]
- pagination:
  - totalDocs: number
  - limit: number
  - page: number
  - totalPages: number
  - prevPage: number | null
  - nextPage: number | null

```

### Users

This route is exposed just for authentication purposes. There are no resources you can retrieve.

#### POST /users/login

This is an authentication endpoint that lets you receive JSON Web Token. [More about authentication](#authentication)

**Endpoint:**

```
POST /api/v1/users/login
```

**Parameters:**

```
Body (JSON):

- email: string (required)
- password: string (required)
```

**Successful response:**

```
Status: 200

JSON:
- token: JSON Web Token
```

**Failed response:**

```
Status: 401

JSON:
- error:
  - message: "Auth failed"
```

#### GET /users/me

This is a token protected endpoint. [More about authentication](#authentication) This enpoint returns current user's data.

**Endpoint:**

```
GET /api/v1/users/me
```

**Parameters:**

```
No parameters expected
```

**Successful response:**

```
Status: 200

JSON:
- user:
  - _id: string
  - email: string
```

**Failed response:**

```
Status: 401

JSON:
- error:
  - message: "Auth failed"
```

---

## Architecture Design

This app was built from scratch (no boilerplate). It's a Typescript project using express.js and mongoose with mongodb. All endpoints were covered by tests. For testing API I used supertest to mock requests to "app". For testing purposes I'm spinning up "mongodb-memory-server" and I'm clearing db for each test. I created a small fixture factory to help me test Providers endpoints. Later on I published an NPM library based on a solution I used building this project - [worp](https://www.npmjs.com/package/worp).

For pagination I used "mongoose-paginate-v2" plugin.

Filtering and projection is made more or less "manually" in a controller.

GitHub repo restricts PRs to master branch to pass Travis CI build.

Master branch is automatically deployed to staging environment on Heroku. Production can be deployed manually.

---

## Development

### Seeds

It is sometimes useful to populate database with some prepared data/fixtures. I created a simple seed CLI runner. Just type:

```bash
npm run seed name_of_seed_here
```

#### Create Master User Seed

Since this API does not expose any sign-up endpoint we can create a master user by seeds. Just provide user's email and password via ENV and run a seed.

**ENVs:**

- `MASTER_USER_EMAIL`
- `MASTER_USER_PASSWORD`

**Command to run this seed:**

```bash
npm run seed createMasterUser
```

#### Populate Providers Seed

For development purposes you can populate your DB with 300 Providers comming from automatically generated fixtures:

```bash
npm run seed populateProviders
```
