let express = require("express");
let router = express.Router();
let db = require("../config/db");
let sendJson = require("../helpers/sendJson");

/* GET band by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT band_id, title, origin_city, founded, ended, country
		FROM band
		WHERE band_id = $1
	`;

	selectInfoWith(res, sqlQuery, id);
});

/* GET band's history by id */
router.get("/:id/history", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT history
		FROM band
		WHERE band_id = $1
	`;

	selectInfoWith(res, sqlQuery, id);
});

/* GET band's discography by id */
router.get("/:id/discography", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT album.title AS album, album.released AS released, album_type.type AS album_type 
		FROM band
		LEFT JOIN "album/band" alband ON alband.band_id = band.band_id
		LEFT JOIN album ON album.album_id = alband.album_id
		LEFT JOIN album_type ON album.type = album_type.album_type_id
		WHERE band.band_id = $1
		ORDER BY alband.order ASC
	`;

	selectInfoWith(res, sqlQuery, id);
});

const selectInfoWith = async (res, sqlQuery, param) => {
	try {
		const band = await db.any(sqlQuery, param);
		sendJson(res, band);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = router;
