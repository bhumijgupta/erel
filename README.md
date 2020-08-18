# EREL

> Express-route-exit-log (EREL) is an customisable express middleware package to log useful request insights when route execution finishes

#### Features

- Written in TypeScript
- Included types for intellisense in IDE
- Supports both CJS and ESM modules
- Small package and easy to set up
- Support for custom logging solution
- Provides route insights like:-
  - Request IP Address
  - Response status code
  - Request execution start time
  - Request execution end time
  - Request access method
  - Route execution time

## Install

```bash
# NPM
npm i erel --save

# Yarn
yarn add erel
```

## Usage

1. For JavaScript

```javascript
const express = require('express');
const app = express();
// Import exitLog from erel
const { exitLog } = require('erel');
// Use your custom logging solution (optional but preferred)
const customLogger = (data, req, res) => {
  Logger.info(
    `${data.timestamp} - ${data.ip} - ${data.method} - ${data.route} - ${data.statusCode} - ${data.responseTime}`,
  );
};
exitLog.setLogger(customLogger);
// Configure express app to use the middleware
app.use(exitLog.middleware);
```

2. For TypeScript

```typescript
import * as express from 'express';
const app = express();
// import exitLog and LoggerCallback from erel
import { exitLog, LoggerCallback } from 'erel';
// Use your custom logging solution (optional but preferred)
const customLogger: LoggerCallback = (data, req, res) => {
  Logger.info(
    `${data.timestamp} - ${data.ip} - ${data.method} - ${data.route} - ${data.statusCode} - ${data.responseTime}`,
  );
};
exitLog.setLogger(customLogger);
// Configure express app to use the middleware
app.use(exitLog.middleware);
```

## API Reference

### exitLog

- #### `exitLog.setLogger`

`setLogger` method can be used to set your custom Logging function which will be called along with the request insights.
It accepts a logger function as argument which implements the `LoggerCallback` interface. See [LoggerCallback](#LoggerCallback) for more details.

```typescript
// Example
import { exitLog } from 'erel';
// req and res is also passed to log custom objects, like req.userId
exitLog.setLogger((data, req, res) => {
  Logger.log(`${data.timestamp} - ${req.userId} - ${data.ip} - ${data.statusCode}`);
});
```

- #### `exitLog.middleware`

`middleware` is the inbuilt middleware function to be configured with express to use. This middleware will call the custom Logger function (if set using `exitLog.setLogger`), otherwise the default Logger.

```typescript
// Example
import * as express from 'express';
import { exitLog } from 'erel';
const app = express();
app.use(exitLog.middleware);
```

### LoggerCallback

`LoggerCallback` is an interface for the custom logger function to be used.

```typescript
type LoggerCallback = (data: exitData, req?: Request, res?: Response) => void;
// data -> request insights
// req -> express request object
// res -> express response object
```

`data` contains the following properties
| Property | Type | Description |
|--------------|:-------------------:|:---------------------------------------------------:|
| `rawEnterDate` | `Date` | Date when request entered the route |
| `rawExitDate` | `Date` | Date when request finished route execution |
| `timestamp` | `string` | Timestamp when route finished execution |
| `statusCode` | `number` | Response status code |
| `route` | `string` | Route accessed |
| `ip` | `string | undefined` | IP address of the request |
| `responseTime` | `number` | Time taken in millisecond to finish route execution |
| `method` | `string` | Request method to access the endpoint |

## Author

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

### Bhumij Gupta

![GitHub followers](https://img.shields.io/github/followers/bhumijgupta?label=Follow&style=social) [![LinkedIn](https://img.shields.io/static/v1.svg?label=connect&message=@bhumijgupta&color=success&logo=linkedin&style=flat&logoColor=white)](https://www.linkedin.com/in/bhumijgupta/) [![Twitter URL](https://img.shields.io/twitter/url?style=social&url=http%3A%2F%2Ftwitter.com%2Fbhumijgupta)](https://twitter.com/bhumijgupta)

---

```javascript
if (repo.isAwesome || repo.isHelpful) {
  StarRepo();
}
```
