let express = require("express");
let router = express.Router();
let connectionString = require("../config/database");
let pgp = require("pg-promise")();
let db = pgp(connectionString);
let jsonParser = require("body-parser").json();

/* GET all albums */
router.get("/", async (req, res, next) => {
	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
	`;

	try {
		const albums = await db.any(sqlQuery);
		res.json({
			message: "success",
			data: albums,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/* GET album by title */
router.get("/:title", async (req, res, next) => {
	let title = req.params.title.replace(/-/g, " ");

	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album 
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower($1)) > 0
	`;

	try {
		const album = await db.any(sqlQuery, title);
		res.json({
			message: "success",
			data: album,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
