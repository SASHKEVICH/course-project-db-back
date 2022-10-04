let express = require("express");
let router = express.Router();
let db = require("../config/db");
let sendJson = require("../helpers/sendJson");

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
		sendJson(res, albums);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/* GET album by title */
router.get("/title=:title", async (req, res, next) => {
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
		sendJson(res, album);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/* GET album by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = $1
		LEFT JOIN band ON band.band_id = alband.band_id
	`;

	try {
		const album = await db.any(sqlQuery, id);
		sendJson(res, album);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
