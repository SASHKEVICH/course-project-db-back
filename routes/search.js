let express = require("express");
let router = express.Router();
let connectionString = require("../config/db");
let db = require("../config/db");
let sendResult = require("../helpers/sendJson");

module.exports = router;
