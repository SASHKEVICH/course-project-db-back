const express = require("express");
const router = express.Router();
const sendResult = require("../helpers/sendResult");
const selectInfo = require("../helpers/selectInfo");

/* GET genres of album */
router.get("/album=:id", async (req, res, next) => {
	const albumId = req.params.id;
	const sqlQuery = `
		SELECT genre.name AS genre
		FROM album
		LEFT JOIN "genre/album" algenre ON algenre.album_id = album.album_id
		LEFT JOIN genre ON genre.genre_id = algenre.genre_id
		WHERE album.album_id = $1
	`;

	const genres = await selectInfo(sqlQuery, [albumId]);
	convertGenresToList(genres);
	sendResult(res, genres);
});

/* GET genres of band */
router.get("/band=:id", async (req, res, next) => {
	const albumId = req.params.id;
	const sqlQuery = `
		SELECT genre.name AS genre
		FROM band
		LEFT JOIN "genre/band" bdgenre ON bdgenre.band_id = band.band_id
		LEFT JOIN genre ON genre.genre_id = bdgenre.genre_id
		WHERE band.band_id = $1
	`;

	const genres = await selectInfo(sqlQuery, [albumId]);
	convertGenresToList(genres);
	sendResult(res, genres);
});

const convertGenresToList = (genres) => {
	const genresList = [];
	genres.info.forEach((e) => {
		genresList.push(e.genre);
	});
	genres.info = genresList;
};

module.exports = router;
