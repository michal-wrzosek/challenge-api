# Challenge API - REST API

---

# Documentation

- [Authentication](#authentication)
- [Error responses](#error-responses)
- Routes:
  - [Providers](#providers)
  - [Users](#users)

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

## Providers

This route lets you query "Providers" resource.

### GET /providers

This endpoint let's you receive a list of Providers

```
GET /api/v1/providers
```

**Parameters:**

```
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

## Users

This route is exposed just for authentication purposes. There are no resources you can retrieve.

### POST /users/login

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
