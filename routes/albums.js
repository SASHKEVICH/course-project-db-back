let express = require('express');
let router = express.Router();
let connectionString = require('../config/database')
let pgp = require('pg-promise')()
let db = pgp(connectionString)
let jsonParser = require('body-parser').json()

router.get('/', async (req, res, next) => {
	let sqlQuery = `SELECT * FROM album`
	let params = []

	try {
		const albums = await db.any(sqlQuery);
		res.json({
			"message": "success",
			"data": albums
		});
	} 
	catch (err) {
		res.status(400).json({"error": err.message})
	}
});

module.exports = router