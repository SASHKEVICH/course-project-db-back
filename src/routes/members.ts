import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import sendError from "../helpers/sendError";
import select, { selectOne, selectMany } from "../helpers/selectInfo";
import auth from "../middleware/auth";
import prisma from "../database/prisma";

import { ResponseMember } from "../types/member/responseMember";
import { SelectError, SelectErrorCodes } from "../types/errors/select/selectError";
import { BackendError } from "../types/errors/backendError";

const router = Router();

/* GET member's info */
router.get("/one/:id", async (req, res, next) => {
	console.log("--GET member's info")
	const memberId = req.params.id;
	const selectMember = `
		SELECT 
			member.member_id,
			name,
			member.photo_path,
			to_char(birth_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS birth_date,
			to_char(die_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS die_date,
			member.origin_city,
			biography,
			json_agg(json_build_object(
				'band_id', band.band_id,
				'title', band.title
			)) AS currentBands
		FROM member
		LEFT JOIN "member/band" memband ON memband.member_id = member.member_id
		LEFT JOIN band ON band.band_id = memband.band_id
		WHERE member.member_id = $1 AND memband.previous = false
		GROUP BY member.member_id
	`;
	
	try {
		try {
			const member = await selectOne<ResponseMember>(selectMember, [memberId]);
			sendResult(res, member);
		} catch (e) {
			throw new SelectError("Member not found", SelectErrorCodes.notFoundMember);
		}
	} catch (error) {
		sendError(res, error as BackendError);
	}
});

/* BELOW USES TOKENS */

/* GET all members */
router.get("/", auth, async (req, res) => {
	console.log("--GET all members")
	let sqlQuery = `
		SELECT member.*, band.title AS band
		FROM member
		LEFT JOIN "member/band" memband ON memband.member_id = member.member_id
		LEFT JOIN band ON band.band_id = memband.band_id
	`;

	const albums = await selectInfo(sqlQuery, [""]);
	sendResult(res, albums);
});

/* ADD member to band */
router.post("/add-to-band", auth, async (req, res) => {
	console.log("--POST add member to band");
	const body = req.body;
	try {
		const memberBandId = await prisma.member_band.findFirst({
			where: {
				member_id: body.memberId
			},
			select: {
				member_id: true,
				band_id: true
			}
		});

		let member = {};

		if (memberBandId) {
			member = await prisma.member_band.update({
				data: {
					band_id: body.bandId,
					previous: false
				},
				where: {
					band_id_member_id: memberBandId
				}
			})
		} else {
			member = await prisma.member_band.create({
				data: {
					member: {
						connect: {
							member_id: body.memberId
						}
					},
					band: {
						connect: {
							band_id: body.bandId
						}
					},
					previous: false
				}
			})
		};

		res.status(201).json({
			message: "success",
			member
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

/* CREATE member */
router.post("/", auth, async (req, res) => {
	console.log("--POST create member");
	const body = req.body;
	try {
		const member = await prisma.member.create({
			data: {
				name: body.name,
				biography: body.biography,
				birth_date: body.birthDate != null ? new Date(body.birthDate) : null,
				die_date: body.dieDate != null ? new Date(body.dieDate) : null,
				origin_city: body.origin,
				photo_path: body.photoPath
			}
		});

		res.status(201).json({
			message: "success",
			member
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "create error"
		})
	}
});

/* UPDATE member */
router.put("/", auth, async (req, res) => {
	console.log("--PUT update member");
	const body = req.body;
	try {
		const member = await prisma.member.update({
			where: {
				member_id: body.memberId
			},
			data: {
				name: body.name,
				biography: body.biography,
				birth_date: body.birthDate != null ? new Date(body.birthDate) : null,
				die_date: body.dieDate != null ? new Date(body.dieDate) : null,
				origin_city: body.origin,
				photo_path: body.photoPath
			}
		});

		res.status(201).json({
			message: "success",
			member
		});
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "failure",
			error: "updating error"
		})
	}
});

/* DELETE member */
router.delete("/", auth, async (req, res) => {
	console.log("--DELETE member");
	const body = req.body;
	try {
		const member = await prisma.member.deleteMany({
			where: {
				member_id: { in: body.memberIds }
			}
		});

		res.status(201).json({
			message: "success",
			member
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
