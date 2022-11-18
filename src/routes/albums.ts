import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

const router = Router();

/* GET all albums */
router.get("/", async (req, res, next) => {
	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
	`;

	const albums = await selectInfo(sqlQuery, [""]);
	sendResult(res, albums);
});

/* GET album by title */
router.get("/title=:title", async (req, res, next) => {
	const title: string = req.params.title.replace(/-/g, " ");

	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album 
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower($1)) > 0
	`;

	const album = await selectInfo(sqlQuery, [title]);
	sendResult(res, album);
});

/* GET album by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT 
			album.title AS title,
			album.album_cover_path AS cover,
			album.released AS released,
			album.explicit AS explicit,
			album.history AS history,
			album_type.type AS type,
			band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		LEFT JOIN album_type ON album_type.album_type_id = album.type
		WHERE album.album_id = $1
	`;

	const album = await selectInfo(sqlQuery, [id]);
	sendResult(res, album);
});

export default router;
