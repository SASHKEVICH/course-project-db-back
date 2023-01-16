import { Router } from "express";
import { album, genre, member } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import { selectMany, selectOne } from "../helpers/selectInfo";
import prisma from "../database/prisma";
import auth from "../middleware/auth";

import { ResponseBand } from "../types/band/responseBand";
import sendError from "../helpers/sendError";
import { SelectCodes, SelectError } from "../types/errors/select/selectError";
import { SelectErrorCodes } from "../types/errors/select/selectError";
import { BackendError } from "../types/errors/backendError";

const router = Router();

/* GET band by id */
router.get("/one/:id", async (req, res) => {
	const id = req.params.id;
	console.log(`--GET one band by id:${id}`);
	const selectBand = `
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

	const selectAlbums = `
		SELECT 
			album.album_id,
			album.title,
			album_cover_path
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE band.band_id = $1
		ORDER BY album.released DESC
	`;

	const selectGenres = `
		SELECT 
			genre.genre_id,
			name
		FROM genre
		LEFT JOIN "genre/band" bandgenre ON bandgenre.genre_id = genre.genre_id
		LEFT JOIN band ON band.band_id = bandgenre.band_id
		WHERE band.band_id = $1
	`;

	const selectMembers = `
		SELECT 
			member.member_id, 
			name
		FROM member
		LEFT JOIN "member/band" memband ON memband.member_id = member.member_id
		LEFT JOIN band ON band.band_id = memband.band_id
		WHERE band.band_id = $1
	`;

	try {
		let band: ResponseBand
		try {
			band = await selectOne<ResponseBand>(selectBand, [id]);
		} catch (error) {
			throw new SelectError("Band not found", SelectErrorCodes.notFoundBand);
		}
		
		const albums = await selectMany<album>(selectAlbums, [id]);
		const genres = await selectMany<genre>(selectGenres, [id]);
		const members = await selectMany<member>(selectMembers, [id]);

		band.albums = albums;
		band.genres = genres;
		band.members = members;

		sendResult(res, band);
	} catch (error) {
		sendError(res, error as BackendError);
		console.error(error)
	}
});

/* BELOW USES TOKENS */

/* GET band's title and id */
router.get("/short", auth, async (req, res) => {
	console.log("--GET band's title and id");
	const bands = await prisma.band.findMany({
		select: {
			band_id: true,
			title: true,
		}
	});

	sendResult(res, bands);
});

/* GET all bands */
router.get("/", auth, async (req, res) => {
	console.log("--GET all bands");
	const sqlQuery = `
		SELECT 
			band.*,
			coalesce(json_agg(json_build_object(
				'genre_id', genre.genre_id,
				'name', genre.name
			)) FILTER (WHERE genre.genre_id IS NOT NULL), '[]'::json) AS genres
		FROM band
		LEFT JOIN "genre/band" bdgenre ON bdgenre.band_id = band.band_id
		LEFT JOIN genre ON genre.genre_id = bdgenre.genre_id
	`;

	const bands = await selectMany<ResponseBand>(sqlQuery);
	sendResult(res, bands);
});

/* ADD genre to band */
router.post("/add-genre", auth, async (req, res) => {
	console.log("--POST add genre to band");
	const body = req.body;
	try {
		const genreBandId = await prisma.genre_band.findFirst({
			where: {
				band_id: body.bandId
			},
			select: {
				genre_id: true,
				band_id: true
			}
		});

		let band = {};

		if (genreBandId) {
			band = await prisma.genre_band.update({
				data: {
					genre_id: body.genreId
				},
				where: {
					genre_id_band_id: genreBandId
				}
			})
		} else {
			band = await prisma.genre_band.create({
				data: {
					genre: {
						connect: {
							genre_id: body.genreId
						}
					},
					band: {
						connect: {
							band_id: body.bandId
						}
					}
				}
			})
		};

		sendResult(res, band);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: error
		})
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

		sendResult(res, band);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
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

		sendResult(res, band);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE bands */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE bands");
	const body = req.body;
	const ids: number[] = body.genreIds
	try {
		const band = await prisma.band.deleteMany({
			where: {
				band_id: { in: ids }
			}
		});

		sendResult(res, band);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

export default router;
