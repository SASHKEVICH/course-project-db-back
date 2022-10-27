const express = require("express");
const router = express.Router();
const sendResult = require("../helpers/sendResult");
const selectInfo = require("../helpers/selectInfo");

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
			public.member.member_id AS id,
			public.member.name AS name,
			public.member.birth_date AS bdate,
			public.member.die_date AS ddate,
			public.member.origin_city AS origin
		FROM public.member
		WHERE public.member.member_id = $1
	`;

	const member = await selectInfo(sqlQuery, [memberId]);
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

module.exports = router;
