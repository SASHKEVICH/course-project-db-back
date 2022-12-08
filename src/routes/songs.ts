import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";
import prisma from "../database/prisma";
import auth from "../middleware/auth"

const router = Router();

/* GET songs in album by title and band*/
router.get("/album=:title&band=:band", async (req, res) => {
	// @ts-ignore
	const album: string = req.params.title.replace(/-/g, " ");
	// @ts-ignore
	const band: string = req.params.band.replace(/-/g, " ");

	const selectAlbumId = `
		SELECT album.album_id 
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower($1)) > 0 
			AND strpos(lower(band.title), lower($2)) > 0
	`;

	const selectSongs = `
		SELECT song.song_id, song.title AS song, album.title AS album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	const albums = await selectInfo(selectAlbumId, [album, band]);
	const albumId = albums.info?.map((e) => e.album_id)[0];
	const songs = await selectInfo(selectSongs, albumId);
	sendResult(res, songs);
});

/* GET songs in album by id*/
router.get("/albumId=:album_id", async (req, res) => {
	const albumId = req.params.album_id;

	const selectSongs = `
		SELECT 
			song.song_id, 
			song.duration, 
			album.album_id,
			song.title AS title,
			song.explicit,
			album.title AS album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	const songs = await selectInfo(selectSongs, [albumId]);
	sendResult(res, songs);
});

/* BELOW USES TOKENS */

/* GET all songs */
router.get("/", auth, async (req, res) => {
	console.log("--GET all songs");
	const songs = await prisma.song.findMany();
	res.status(200).json({
		message: "success",
		songs
	});
});

/* ADD song to album */
router.post("/add-to-album", auth, async (req, res) => {
	console.log("--POST add song to album");
	const body = req.body;
	try {
		const album = await prisma.album.update({
			where: {
				album_id: body.albumId
			},
			data: {
				album_song: {
					create: {
						song_id: body.songId,
						order: body.order
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			album
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

/* DELETE song from album */
router.delete("/del-from-album", auth, async (req, res) => {
	console.log("--DELETE song from album");
	const body = req.body;
	try {
		const album = await prisma.album.update({
			where: {
				album_id: body.albumId
			},
			data: {
				album_song: {
					deleteMany: {
						song_id: body.songId
					}
				}
			}
		});

		res.status(201).json({
			message: "success",
			album
		});
	} catch (error) {
		console.error(error)
		if (error instanceof Prisma.PrismaClientValidationError) {
			console.log(error.message)
			res.status(400).json({
				message: "failure",
				error: error
			})
    };
	}
});

/* CREATE song */
router.post("/", auth, async (req, res) => {
	console.log("--POST create song");
	const body = req.body;
	try {
		const song = await prisma.song.create({
			data: {
				title: body.title,
				explicit: body.explicit,
				duration: body.duration
			}
		});

		res.status(201).json({
			message: "success",
			song
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "creating error"
		})
	}
});

/* UPDATE song */
router.put("/", auth, async (req, res) => {
	console.log("--PUT update song");
	const body = req.body;
	try {
		const song = await prisma.song.update({
			where: {
				song_id: body.songId
			},
			data: {
				title: body.title,
				explicit: body.explicit,
				duration: body.duration
			}
		});

		res.status(201).json({
			message: "success",
			song
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE song */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE song");
	const body = req.body;
	try {
		const song = await prisma.song.delete({
			where: {
				song_id: body.songId
			}
		});

		res.status(201).json({
			message: "success",
			song
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
