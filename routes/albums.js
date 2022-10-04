let express = require("express");
let router = express.Router();
let db = require("../config/db");
let sendResult = require("../helpers/sendResult");

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
		sendResult(res, albums);
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
		sendResult(res, album);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/* GET songs in album by title and band*/
router.get("/:title&:band/songs", async (req, res, next) => {
	const album = req.params.title.replace(/-/g, " ");
	const band = req.params.band.replace(/-/g, " ");

	const selectAlbumId = `
		SELECT album.album_id 
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower($1)) > 0 
			AND strpos(lower(band.title), lower($2)) > 0
	`;

	const selectSongs = `
		SELECT song.title AS song, album.title AS album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = $1
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	try {
		const albums = await db.any(selectAlbumId, [album, band]);
		const albumId = albums.map((e) => e.album_id)[0];
		const songs = await db.any(selectSongs, albumId);

		sendResult(res, songs);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
