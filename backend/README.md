# Maly Backend

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Routes

### URL Shortner

- **POST** `/api/url-shortener` - creates a new shortened url

**Request**

```json
{
  "url": "string"
}
```

**Response**

```json
{
  "short_url": "string"
}
```

- **GET** `/api/url-shortener?url=<short-url>` - redirects the user to the original url from the shortened version

**Response**

```json
{
  "ok": "boolean"
}
```