# Dockerfile for running Prisma

# change with the Node.js version of your choice
ARG NODE_VERSION="19"

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /opt/app

RUN apt-get update && apt-get install -y \
	  openssl \
    && rm -rf /var/lib/apt/lists/*

COPY . .


FROM base AS dev

RUN npm install && \
		npm rebuild brcypt

ENTRYPOINT ["npm", "run"]


FROM base AS prod

RUN npm ci --production && \
		npm rebuild bcrypt

RUN npx prisma generate

RUN npm run build && \
		npm run start

