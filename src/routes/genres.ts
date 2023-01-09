import { Router } from "express";
import sendResult from "../helpers/sendResult";
import prisma from "../database/prisma";
import auth from "../middleware/auth"
import { SelectCodes } from "../types/errors/select/selectError";

const router = Router();

/* BELOW USES TOKENS */

/* GET all genres */
router.get("/", auth, async (req, res) => {
	console.log("--GET all genres");
	const genres = await prisma.genre.findMany();
	sendResult(res, genres);
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
		sendResult(res, genre);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
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

		sendResult(res, genre);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE genre */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE genre");
	const body = req.body;
	try {
		const genre = await prisma.genre.delete({
			where: {
				genre_id: body.genreId
			}
		});

		sendResult(res, genre);
	} catch (error) {
		console.error(error)
		res.status(SelectCodes.Failure).json({
			message: "failure",
			error: "deleting error"
		})
	}
});

export default router;
