import pgPromise from "pg-promise";

const cn = process.env.DATABASE_URL;
const pgp = pgPromise();
const db = pgp(cn);

export default db;
