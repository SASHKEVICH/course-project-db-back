import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";
import prisma from "../database/prisma";
import auth from "../middleware/auth";

const router = Router();

/* GET band's title and id */
router.get("/short", auth, async (req, res) => {
	console.log("--GET band's title and id");
	const bands = await prisma.band.findMany({
		select: {
			band_id: true,
			title: true,
		}
	});
	res.status(200).json({
		message: "success",
		bands
	});
});

/* GET band by id */
router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT 
			band_id, 
			title, 
			origin_city,
			photo_path,
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

	const info = band.info?.pop();
	const mergedBand = {
		...info,
		albums: albums.info,
		genres: genresArray,
		currentMembers: currentMembers.info,
		previousMembers: previousMembers.info
	};

	// @ts-ignore
	band.info = mergedBand
	sendResult(res, band);
});

/* GET band's history by id */
router.get("/:id/history", async (req, res) => {
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
router.get("/:id/discography", async (req, res) => {
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

/* BELOW USES TOKENS */

/* GET all bands */
router.get("/", auth, async (req, res) => {
	console.log("--GET all bands");
	const bands = await prisma.band.findMany();
	res.status(200).json({
		message: "success",
		bands
	});
});

/* ADD genre to band */
router.post("/add-genre", auth, async (req, res) => {
	console.log("--POST add genre to band");
	const body = req.body;
	try {
		const band = await prisma.band.update({
			where: {
				band_id: body.bandId
			},
			data: {
				genre_band: {
					create: {
						genre_id: body.genreId,
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		console.error(error)
		if (error instanceof Prisma.PrismaClientValidationError) {
			res.status(400).json({
				message: "failure",
				error: error
			})
    };
	}
});

/* DELETE genre from band */
router.post("/delete-genre", auth, async (req, res) => {
	console.log("--POST delete genre from band");
	const body = req.body;
	try {
		const band = await prisma.band.update({
			where: {
				band_id: body.bandId
			},
			data: {
				genre_band: {
					deleteMany: {
						genre_id: body.genreId,
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		console.error(error)
		if (error instanceof Prisma.PrismaClientValidationError) {
			res.status(400).json({
				message: "failure",
				error: error
			})
    };
	}
});

/* CREATE band */
router.post("/", auth, async (req, res) => {
	console.log("--POST create band");
	const body = req.body;
	try {
		const band = await prisma.band.create({
			data: {
				title: body.title,
				history: body.history,
				origin_city: body.originCity || undefined,
				photo_path: body.photoPath || undefined,
				founded: body.founded != undefined ? new Date(body.founded) : null,
				ended: body.ended != undefined ? new Date(body.ended) : null,
				country: body.country || undefined
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "create error"
		})
	}
});

/* UPDATE band */
router.put("/", auth, async (req, res) => {
	console.log("--PUT update band");
	const body = req.body;
	try {
		const band = await prisma.band.update({
			where: {
				band_id: body.bandId
			},
			data: {
				title: body.title,
				history: body.history,
				origin_city: body.originCity || undefined,
				photo_path: body.photoPath || undefined,
				founded: body.founded != undefined ? new Date(body.founded) : null,
				ended: body.ended != undefined ? new Date(body.ended) : null,
				country: body.country || undefined
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE band */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE band");
	const body = req.body;
	try {
		const band = await prisma.band.delete({
			where: {
				band_id: body.bandId
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

export default router;
