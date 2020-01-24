##########################
# Build Stage

FROM node:12-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

# Create app directory
WORKDIR /usr/src/api

# Install app dependencies

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./tslint*.json ./

RUN npm ci

# Bundle app source
COPY ./src/. ./src

# Run build
RUN npm run build

##########################
# Run Stage

FROM node:12-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /usr/src/api

# Copy compiled files
COPY --from=0 /usr/src/api/dist .
COPY --from=0 /usr/src/api/package*.json ./

# Install packages needed for production
RUN npm ci --only-production

EXPOSE 3101

# Start process
CMD node main.js
