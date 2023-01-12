import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import sendError from "../helpers/sendError";
import { selectMany, selectOne } from "../helpers/selectInfo";
import auth from "../middleware/auth";
import prisma from "../database/prisma";

import { ResponseAlbum } from "../types/album/responseAlbum";
import { SelectError, SelectErrorCodes, SelectCodes } from "../types/errors/select/selectError";

const router = Router();

/* GET types */
router.get("/types", auth, async (_, res) => {
	console.log("--GET album types");
	try {
		const types = await prisma.album_type.findMany();
		res.status(SelectCodes.Success).json({
			message: "success",
			types
		});
	} catch (error) {
		res.status(SelectCodes.Failure).json({
			message: "failure"
		})
	}
});

/* GET album by id */
router.get("/one/:id", async (req, res, next) => {
	const id = req.params.id;
	const selectAlbum = `
		SELECT 
			album.album_id,
			album.title,
			album.album_cover_path,
			to_char(album.released, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS released,
			album.explicit AS explicit,
			album.history AS history,
			album_type.type AS type,
			band.title AS band,
			json_agg(json_build_object(
				'genre_id', genre.genre_id,
				'genre', genre.name
			)) as genres
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		LEFT JOIN album_type ON album_type.album_type_id = album.type
		LEFT JOIN "genre/album" genalbum ON genalbum.album_id = album.album_id
		LEFT JOIN genre ON genre.genre_id = genalbum.genre_id
		WHERE album.album_id = $1
		GROUP BY album.album_id, band.title, album_type.type
	`;

	try {
		try {
			const responseAlbum: ResponseAlbum = await selectOne<ResponseAlbum>(selectAlbum, [id]);
			sendResult(res, responseAlbum);
		} catch (e) {
			throw new SelectError("Album not found", SelectErrorCodes.notFoundAlbum);
		}
	} catch (error) {
		sendError(res, error as SelectError);
		console.error(error)
	}
});

/* BELOW USES TOKENS */

/* GET all albums */
router.get("/all", auth, async (_, res, next) => {
	console.log("--GET all albums")
	const selectAlbums = `
		SELECT 
			album.*, 
			band.title AS band, 
			album_type.type AS type, 
			json_agg(json_build_object(
				'genre_id', genre.genre_id,
				'genre', genre.name
			)) as genres
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN "genre/album" genalbum ON genalbum.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		LEFT JOIN genre ON genre.genre_id = genalbum.genre_id
		LEFT JOIN album_type on album.type = album_type.album_type_id
		GROUP BY album.album_id, band.title, album_type.type
	`;

	try {
		try {
			const albums: ResponseAlbum[] = await selectMany<ResponseAlbum>(selectAlbums);
			sendResult(res, albums);
		} catch (e) {
			throw new SelectError("No albums found", SelectErrorCodes.notFoundAlbum);
		}
	} catch (error) {
		sendError(res, error as SelectError);
		console.error(error);
	}
});

/* CREATE album */
router.post("/", auth, async (req, res) => {
	console.log("--POST create album");
	const body = req.body;
	try {
		const album = await prisma.album.create({
			data: {
				title: body.title,
				album_cover_path: body.coverPath,
				released: body.released != undefined ? new Date(body.released) : null,
				explicit: body.explicit,
				history: body.history,
				type: body.type
			}
		});

		res.status(SelectCodes.Success).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			res.status(SelectCodes.Failure).json({
				message: "failure",
				error: error.message
			})
		};
	}
});

/* ADD album to band's discography */
router.post("/add-to-disc", auth, async (req, res) => {
	console.log("--POST add album to band");
	const body = req.body;
	try {
		const albumBandId = await prisma.album_band.findFirst({
			where: {
				album_id: body.albumId
			},
			select: {
				album_id: true,
				band_id: true
			}
		});

		let album = {};

		if (albumBandId) {
			album = await prisma.album_band.update({
				data: {
					band_id: body.bandId
				},
				where: {
					album_id_band_id: albumBandId
				}
			})
		} else {
			album = await prisma.album_band.create({
				data: {
					album: {
						connect: {
							album_id: body.albumId
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

		res.status(SelectCodes.Success).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: error
		})
	}
});

/* UPDATE album */
router.put("/", auth, async (req, res) => {
	console.log("--PUT update album");
	const body = req.body;
	try {
		const album = await prisma.album.update({
			where: {
				album_id: body.albumId
			},
			data: {
				title: body.title,
				album_cover_path: body.coverPath,
				released: new Date(body.released),
				explicit: body.explicit,
				history: body.history,
				type: body.type
			}
		});

		res.status(SelectCodes.Success).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE album */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE album");
	const body = req.body;
	const ids: number[] = body.albumIds
	try {
		const album = await prisma.album.deleteMany({
			where: {
				album_id: { in: ids }
			},
		});

		res.status(SelectCodes.Success).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

/* ADD genre to album */
router.post("/add-genre", auth, async (req, res) => {
	console.log("--POST add genre to album");
	const body = req.body;
	try {
		const albumGenreId = await prisma.genre_album.findFirst({
			where: {
				album_id: body.albumId
			},
			select: {
				album_id: true,
				genre_id: true
			}
		});

		let album = {};

		if (albumGenreId) {
			album = await prisma.genre_album.update({
				data: {
					genre_id: body.genreId
				},
				where: {
					album_id_genre_id: albumGenreId
				}
			})
		} else {
			album = await prisma.genre_album.create({
				data: {
					album: {
						connect: {
							album_id: body.albumId
						}
					},
					genre: {
						connect: {
							genre_id: body.genreId
						}
					}
				}
			})
		};

		res.status(SelectCodes.Success).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		if (error instanceof Prisma.PrismaClientValidationError) {
			res.status(SelectCodes.Failure).json({
				message: "failure",
				error: error
			})
		};
	}
});

export default router;
