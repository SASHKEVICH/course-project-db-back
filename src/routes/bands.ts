import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

const router = Router();

/* GET band by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT 
			band_id, 
			title, 
			origin_city,
			to_char(founded, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS founded,
			to_char(ended, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS ended,
			country, 
			history
		FROM band
		WHERE band_id = $1
	`;

	const selectDiscography = `
		SELECT 
			album.album_id, 
			album.title AS title, 
			album.album_cover_path AS cover 
		FROM band
		LEFT JOIN "album/band" alband ON alband.band_id = band.band_id
		LEFT JOIN album ON album.album_id = alband.album_id
		LEFT JOIN album_type ON album.type = album_type.album_type_id
		WHERE band.band_id = $1
		ORDER BY alband.order ASC
	`;

	const selectGenres = `
		SELECT genre.name AS genre
		FROM band
		LEFT JOIN "genre/band" bandgenre ON bandgenre.band_id = band.band_id
		LEFT JOIN genre ON genre.genre_id = bandgenre.genre_id
		WHERE band.band_id = $1
	`;

	const selectMembers = `
		SELECT public.member.member_id AS id, public.member.name AS name
		FROM band
		LEFT JOIN "member/band" memband ON memband.band_id = band.band_id
		LEFT JOIN public.member ON public.member.member_id = memband.member_id
		WHERE band.band_id = $1 AND memband.previous = $2
		ORDER BY id ASC
	`

	const band = await selectInfo(sqlQuery, [id]);
	const albums = await selectInfo(selectDiscography, [id]);
	const genres = await selectInfo(selectGenres, [id]);
	const currentMembers = await selectInfo(selectMembers, [id, false]);
	const previousMembers = await selectInfo(selectMembers, [id, true]);

	const genresArray: String[] = []
	genres.info?.forEach((elem) => {genresArray.push(elem['genre'])})

	// @ts-ignore
	const info = band.info[0];
	const mergedBand = {
		...info,
		albums: albums.info,
		genres: genresArray,
		currentMembers: currentMembers.info,
		previousMembers: previousMembers.info
	}

	// @ts-ignore
	band.info = mergedBand
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
