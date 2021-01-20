##########################
# Build Stage

FROM node:14-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

# Create app directory
WORKDIR /usr/src/api

# Install app dependencies

COPY ./package*.json ./
RUN npm ci --no-progress --no-audit --prefer-offline

COPY ./tsconfig*.json ./
COPY ./tslint*.json ./

# Bundle app source
COPY ./src/. ./src

# Run build
RUN npm run build

##########################
# Run Stage

FROM node:14-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /usr/src/api

# Install packages needed for production
COPY --from=0 /usr/src/api/package*.json ./
RUN npm ci --only-production --no-progress --no-audit --prefer-offline

# Copy compiled files
COPY --from=0 /usr/src/api/dist .

ENV NODE_ENV=docker

# Start process
CMD node src/main.js
