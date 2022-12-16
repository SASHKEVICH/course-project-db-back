import { Router } from "express";
import { Prisma } from "@prisma/client";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";
import auth from "../middleware/auth";
import prisma from "../database/prisma";

const router = Router();

/* GET all members of band */
router.get("/band=:id", async (req, res, next) => {
	const bandId = req.params.id;
	const sqlQuery = `
		SELECT public.member.member_id AS id, public.member.name AS name
		FROM band
		LEFT JOIN "member/band" memband ON memband.band_id = band.band_id
		LEFT JOIN public.member ON public.member.member_id = memband.member_id
		WHERE band.band_id = $1
		ORDER BY id ASC
	`;

	const members = await selectInfo(sqlQuery, [bandId]);
	sendResult(res, members);
});

/* GET current members of band */
router.get("/band=:id/current", async (req, res, next) => {
	const bandId = req.params.id;
	const sqlQuery = `
		SELECT public.member.member_id AS id, public.member.name AS name
		FROM band
		LEFT JOIN "member/band" memband ON memband.band_id = band.band_id
		LEFT JOIN public.member ON public.member.member_id = memband.member_id
		WHERE band.band_id = $1 AND memband.previous = false
		ORDER BY id ASC
	`;

	const members = await selectInfo(sqlQuery, [bandId]);
	sendResult(res, members);
});

/* GET member's info */
router.get("/:id", async (req, res, next) => {
	const memberId = req.params.id;
	const sqlQuery = `
		SELECT 
			member_id AS id,
			name AS name,
			photo_path,
			to_char(birth_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS bdate,
			to_char(die_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS ddate,
			origin_city AS origin,
			biography
		FROM member
		WHERE member_id = $1
	`;

	const selectCurrentBands = `
		SELECT band.band_id AS band_id, band.title AS title
		FROM band
		LEFT JOIN "member/band" memband ON memband.band_id = band.band_id
		LEFT JOIN member ON member.member_id = memband.member_id
		WHERE member.member_id = $1 AND memband.previous = false
		ORDER BY id ASC
	`;

	const member = await selectInfo(sqlQuery, [memberId]);
	const currentBands = await selectInfo(selectCurrentBands, [memberId]);

	// @ts-ignore
	const info = member.info[0]
	const mergedMember = {
		...info,
		currentBands: currentBands.info
	};

	// @ts-ignore
	member.info = mergedMember;
	sendResult(res, member);
});

/* GET member's biography */
router.get("/:id/bio", async (req, res, next) => {
	const memberId = req.params.id;
	const sqlQuery = `
		SELECT public.member.biography AS bio
		FROM public.member
		WHERE public.member.member_id = $1
	`;

	const member = await selectInfo(sqlQuery, [memberId]);
	sendResult(res, member);
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
