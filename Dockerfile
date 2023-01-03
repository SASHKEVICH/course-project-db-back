# Dockerfile for running Prisma

# change with the Node.js version of your choice
ARG NODE_VERSION="19"

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /opt/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
	  openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install
RUN npm rebuild bcrypt

COPY . .

RUN npx prisma generate 

FROM base AS prod

RUN npm run build

