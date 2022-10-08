let express = require("express");
let router = express.Router();
const sendResult = require("../helpers/sendResult");
const selectInfo = require("../helpers/selectInfo");

/* GET all albums */
router.get("/", async (req, res, next) => {
	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
	`;

	const albums = await selectInfo(sqlQuery, []);
	sendResult(res, albums);
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

	const album = await selectInfo(sqlQuery, title);
	sendResult(res, album);
});

/* GET album by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE album.album_id = $1
	`;

	const album = await selectInfo(sqlQuery, id);
	sendResult(res, album);
});

module.exports = router;
