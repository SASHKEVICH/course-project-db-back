import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

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

export default router;
