# Challenge API - REST API

---

# Documentation

- [Authentication](#authentication)
- [Error responses](#error-responses)
- [Routes](#routes):
  - [Providers](#providers)
  - [Users](#users)
- [Development](#development)
  - [Seeds](#seeds)

## Authentication

Access to some endpoints is limited. In order to gain access to them you'll need a valid JSON Web Token. This token can be obtained by calling [/api/v1/users/login](#post-userslogin) endpoint. Token is active for 1 hour. When calling protected endpoints you need to attach an Autorization header with your token like this:

```
Header["Authorization"]: "Bearer your_token_here"
```

## Error responses

All errors responses are structured in the same way.

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

This endpoint let's you receive a list of Providers

```
GET /api/v1/providers
```

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
