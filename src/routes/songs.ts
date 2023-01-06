import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import sendError from "../helpers/sendError";
import { selectMany } from "../helpers/selectInfo";
import prisma from "../database/prisma";
import auth from "../middleware/auth"

import { ResponseSong } from "../types/song/responseSong";
import { SelectError, SelectErrorCodes } from "../types/errors/select/selectError";

const router = Router();

/* GET songs in album by id*/
router.get("/albumId=:album_id", async (req, res) => {
	console.log("--GET songs in album");
	const albumId = req.params.album_id;
	const selectSongsQuery = `
		SELECT 
			song.song_id, 
			song.duration,
			song.title AS title,
			song.explicit,
			json_agg(json_build_object(
				'album_id', album.album_id,
				'title', album.title
			)) as album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		GROUP BY song.song_id, alsong.order
		ORDER BY alsong.order ASC
	`;

	try {
		try {
			const songs = await selectMany<ResponseSong>(selectSongsQuery, [albumId]);
			sendResult(res, songs);
		} catch (e) {
			throw new SelectError("No songs found", SelectErrorCodes.notFoundSong);
		}
	} catch (error) {
		sendError(res, error as SelectError);
		console.error(error);
	}
});

/* BELOW USES TOKENS */

/* GET all songs */
router.get("/", auth, async (req, res) => {
	console.log("--GET all songs");
	const selectSongsQuery = `
		SELECT 
			song.*,
			alsong.order AS order,
			json_agg(json_build_object(
				'album_id', album.album_id,
				'title', album.title
			)) as album
		FROM song
		LEFT JOIN "album/song" alsong ON alsong.song_id = song.song_id
		LEFT JOIN album ON album.album_id = alsong.album_id
		GROUP BY song.song_id, alsong.order
	`;

	try {
		try {
			const songs = await selectMany<ResponseSong>(selectSongsQuery, [""]);
			sendResult(res, songs);
		} catch (e) {
			throw new SelectError("No songs found", SelectErrorCodes.notFoundSong);
		}
	} catch (error) {
		sendError(res, error as SelectError);
		console.error(error);
	}
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
