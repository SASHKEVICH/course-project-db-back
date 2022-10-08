require("dotenv").config();
let cn = process.env.DB_CS;

let pgp = require("pg-promise")();
let db = pgp(cn);

module.exports = db;
