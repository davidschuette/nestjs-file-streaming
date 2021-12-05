# NestJS File Streaming
[![CodeQL](https://github.com/davidschuette/nestjs-file-streaming/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/davidschuette/nestjs-file-streaming/actions/workflows/codeql-analysis.yml)

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

## Setup

### Docker

- `docker-compose up -d`
- Swagger documentation can be found at `http://localhost:3101/api/`

### Local

- Start a MongoDB instance with default configuration
- Use `npm start` to compile and start the server
- Swagger documentation can be found at `http://localhost:3101/api/`

## Usage

- Upload a file: `POST` to `http://localhost:3101/` as multipart/form-data with `file` field
- Download an uploaded file: `GET` to `http://localhost:3101/<id>`
- `GET` to `http://localhost:3101` for list of uploaded videos
- More information can be found in the Swagger Documentation


## _Caution! This is not a production grade server_
