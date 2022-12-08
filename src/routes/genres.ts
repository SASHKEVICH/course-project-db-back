import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

import auth from "../middleware/auth"

const prisma = new PrismaClient();
const router = Router();

/* GET genres of album */
router.get("/album=:id", async (req, res, next) => {
	const albumId = req.params.id;
	const sqlQuery = `
		SELECT genre.name AS genre
		FROM album
		LEFT JOIN "genre/album" algenre ON algenre.album_id = album.album_id
		LEFT JOIN genre ON genre.genre_id = algenre.genre_id
		WHERE album.album_id = $1
	`;

	const genres = await selectInfo(sqlQuery, [albumId]);
	convertGenresToList(genres);
	sendResult(res, genres);
});

/* GET genres of band */
router.get("/band=:id", async (req, res, next) => {
	const albumId = req.params.id;
	const sqlQuery = `
		SELECT genre.name AS genre
		FROM band
		LEFT JOIN "genre/band" bdgenre ON bdgenre.band_id = band.band_id
		LEFT JOIN genre ON genre.genre_id = bdgenre.genre_id
		WHERE band.band_id = $1
	`;

	const genres = await selectInfo(sqlQuery, [albumId]);
	convertGenresToList(genres);
	sendResult(res, genres);
});

/* BELOW USES TOKENS */

/* GET all genres */
router.get("/", auth, async (req, res) => {
	console.log("--GET all genres");
	const genres = await prisma.genre.findMany();
	res.status(200).json({
		message: "success",
		genres
	});
});

/* CREATE genre */
router.post("/", auth, async (req, res) => {
	console.log("--POST create genre");
	const body = req.body;
	try {
		const genre = await prisma.genre.create({
			data: {
				name: body.name
			}
		});

		res.status(201).json({
			message: "success",
			genre
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* UPDATE genre */
router.put("/", auth, async (req, res) => {
	console.log("--PUT update genre");
	const body = req.body;
	try {
		const genre = await prisma.genre.update({
			where: {
				genre_id: body.genreId
			},
			data: {
				name: body.name
			}
		});

		res.status(201).json({
			message: "success",
			genre
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
	console.log("--DELETE genre");
	const body = req.body;
	try {
		const genre = await prisma.genre.delete({
			where: {
				genre_id: body.genreId
			}
		});

		res.status(201).json({
			message: "success",
			genre
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

const convertGenresToList = (genres: any) => {
	const genresList: Array<string> = [];
	genres.info.forEach((e: any) => {
		genresList.push(e.genre);
	});
	genres.info = genresList;
};

export default router;
