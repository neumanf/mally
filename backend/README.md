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

- **POST** `/api/url-shortner` - creates a new shortned url

**Request**

```json
{
  "url": "string"
}
```

**Response**

```json
{
  "short-url": "string"
}
```

- **GET** `/api/url-shortner?url=<short-url>` - redirects the user to the original url from the shortned version

**Response**

```json
{
  "ok": "boolean"
}
```