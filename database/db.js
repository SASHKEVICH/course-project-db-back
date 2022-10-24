const cn = process.env.DATABASE_URL;
const pgp = require("pg-promise")();
const db = pgp(cn);

module.exports = db;
