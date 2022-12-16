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
	let sqlQuery = `
		SELECT song.*, album.title AS album, alsong.order AS order
		FROM song
		LEFT JOIN "album/song" alsong ON alsong.song_id = song.song_id
		LEFT JOIN album ON album.album_id = alsong.album_id
	`;

	const songs = await selectInfo(sqlQuery, [""]);
	sendResult(res, songs);
});

/* ADD song to album */
router.post("/add-to-album", auth, async (req, res) => {
	console.log("--POST add song to album");
	const body = req.body;
	try {
		const albumSongId = await prisma.album_song.findFirst({
			where: {
				song_id: body.songId
			},
			select: {
				song_id: true,
				album_id: true
			}
		});

		let song = {};

		if (albumSongId) {
			song = await prisma.album_song.update({
				data: {
					album_id: body.albumId,
					order: body.order
				},
				where: {
					album_id_song_id: albumSongId
				}
			})
		} else {
			song = await prisma.album_song.create({
				data: {
					album: {
						connect: {
							album_id: body.albumId
						}
					},
					song: {
						connect: {
							song_id: body.songId
						}
					},
					order: body.order
				}
			})
		};

		res.status(201).json({
			message: "success",
			song
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
		const song = await prisma.song.deleteMany({
			where: {
				song_id: { in: body.songId }
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
