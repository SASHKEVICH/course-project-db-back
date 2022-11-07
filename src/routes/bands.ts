import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

const router = Router();

/* GET band by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT band_id, title, origin_city, founded, ended, country
		FROM band
		WHERE band_id = $1
	`;

	const band = await selectInfo(sqlQuery, [id]);
	sendResult(res, band);
});

/* GET band's history by id */
router.get("/:id/history", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT history
		FROM band
		WHERE band_id = $1
	`;

	const history = await selectInfo(sqlQuery, [id]);
	sendResult(res, history);
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

	const discography = await selectInfo(sqlQuery, [id]);
	sendResult(res, discography);
});

export default router;
