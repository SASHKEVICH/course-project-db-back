import { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";
import auth from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

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

/* GET types */
router.get("/types", auth, async (req, res) => { 
	console.log("--GET album types");
	try {
		const types = await prisma.album_type.findMany();
		res.status(200).json({
			message: "success",
			types
		});
	} catch (error) {
		res.status(400).json({
			message: "failure",
		})
	}
});

/* GET album by id */
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	const sqlQuery = `
		SELECT 
			album.album_id,
			album.title AS title,
			album.album_cover_path AS cover,
			to_char(album.released, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS released,
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

	const selectGenres = `
		SELECT genre.name AS genre
		FROM album
		LEFT JOIN "genre/album" algenre ON algenre.album_id = album.album_id
		LEFT JOIN genre ON genre.genre_id = algenre.genre_id
		WHERE album.album_id = $1
	`

	const album = await selectInfo(sqlQuery, [id]);
	const genres = await selectInfo(selectGenres, [id]);

	const genresArray: String[] = []
	genres.info?.forEach((elem) => {genresArray.push(elem['genre'])})

	// @ts-ignore
	const info = album.info[0];
	const mergedAlbum = {
		...info,
		genres: genresArray
	}
	album.info = mergedAlbum

	sendResult(res, album);
});

/* BELOW USES TOKENS */

/* GET all albums */
router.get("/", auth, async (req, res, next) => {
	let sqlQuery = `
		SELECT album.*, band.title AS band
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
	`;

	const albums = await selectInfo(sqlQuery, [""]);
	sendResult(res, albums);
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
				released: new Date(body.released),
				explicit: body.explicit,
				history: body.history,
				type: body.type
			}
		});

		res.status(201).json({
			message: "success",
			album
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			res.status(400).json({
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
		const band = await prisma.band.update({
			where: {
				band_id: body.bandId
			},
			data: {
				album_band: {
					create: {
						album_id: body.albumId,
						order: body.order
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientValidationError) {
			console.log(error.message)
			res.status(400).json({
				message: "failure",
				error: error
			})
    };
	}
});

/* DELETE album from band's discography */
router.delete("/del-from-disc", auth, async (req, res) => {
	console.log("--DELETE album from band");
	const body = req.body;
	try {
		const band = await prisma.band.update({
			where: {
				band_id: body.bandId
			},
			data: {
				album_band: {
					deleteMany: {
						album_id: body.albumId
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			band
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientValidationError) {
			console.log(error.message)
			res.status(400).json({
				message: "failure",
				error: error
			})
    };
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

		res.status(201).json({
			message: "success",
			album
		});
	} catch (error) {
		res.status(400).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE album */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE album");
	const body = req.body;
	try {
		const album = await prisma.album.delete({
			where: {
				album_id: body.albumId
			}
		});

		res.status(201).json({
			message: "success",
			album
		});
	} catch (error) {
		res.status(400).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

export default router;
