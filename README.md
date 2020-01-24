# NestJS server

## Features

- Efficient upload / download
- Very low RAM usage
- Great for providing large files without storing them in the filesystem
- Accepts `range` header to support partial downloads

## Used packages

- [`Fastify Adapter`](https://www.npmjs.com/package/fastify) for performance
- [`Mongoose`](https://www.npmjs.com/package/mongoose) to connect to MongoDB
- [`MongoDB GridFS`](https://www.npmjs.com/package/mongoose) for streaming chunked files to and from Mongo DB
- [`fastify-multipart`](https://www.npmjs.com/package/fastify-multipart) to parse Multipart forms

## _Caution! This is not a production grade server_

## Setup

### Docker

- `docker-compose up -d`
- Swagger documentation can be found at `/api/`

### local

- Start a MongoDB instance with default configuration
- Use `nest start` or `npm build` and `npm run start:prod` to start the server
- Swagger documentation can be found at `/api/`
