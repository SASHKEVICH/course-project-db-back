# Encyclopedia of Heavy Music (backend)

Encyclopedia of Heavy Music (EHM) designed to store specialized information about heavy music in general.
> This app is my term-project on the subject "Database organization". TUSUR 2022.

## The following data models are currently implemented:
1. Bands
2. Albums (LP, EP, singles)
3. Members of bands
4. Songs
5. Genres

## Future plans to implement:
1. Labels
2. Gears (Amps, Guitar and etc.)
3. Social medias of members and bands

## Technology stack
1. [Typescript](https://www.typescriptlang.org)
2. [Express](https://expressjs.com)
3. [Prisma ORM](https://www.prisma.io)
4. [PostgreSQL](https://www.postgresql.org)
5. [JWT](https://jwt.io)

## Running in docker (recommended)
To run app in docker you need:
1. Install [task](https://taskfile.dev/installation/) on your host machine
2. Run:
    >  `task run-dev` or `docker compose up`
2. In the running container `ehm-back` run via `docker exec`:

    > npx prisma db push
3. Create .env file and insert into it:
    > PORT=your_port \
POSTGRES_USER= \
POSTGRES_PASSWORD= \
POSTGRES_DB=name_of_your_db \
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/${POSTGRES_DB}?schema=public" \

## Mobile
Link to [mobile](https://github.com/SASHKEVICH/EHM) this app uses.
