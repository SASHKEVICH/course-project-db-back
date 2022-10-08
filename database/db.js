require("dotenv").config();
const cn = process.env.DB_CS;
const pgp = require("pg-promise")();
const db = pgp(cn);

module.exports = db;
