import { Router } from "express";
const router = Router();
import sendResult from "../helpers/sendResult.js";
import selectInfo from "../helpers/selectInfo.js";

/* GET social_medias of band */
router.get("/band=:id", async (req, res, next) => {
	const bandId = req.params.id;
	const sqlQuery = `
		SELECT social_media_type.type AS type, social_media.link AS link
		FROM band
		LEFT JOIN "social_media/band" smband ON smband.band_id = band.band_id
		LEFT JOIN social_media ON social_media.social_media_id = smband.social_media_id
		LEFT JOIN social_media_type ON social_media_type.social_media_type_id = social_media.type
		WHERE band.band_id = $1
	`;

	const medias = await selectInfo(sqlQuery, [bandId]);
	sendResult(res, medias);
});

/* GET social_medias of member */
router.get("/member=:id", async (req, res, next) => {
	const memberId = req.params.id;
	const sqlQuery = `
		SELECT social_media_type.type AS type, social_media.link AS link
		FROM public.member
		LEFT JOIN "social_media/member" smmember ON smmember.member_id = public.member.member_id
		LEFT JOIN social_media ON social_media.social_media_id = smmember.social_media_id
		LEFT JOIN social_media_type ON social_media_type.social_media_type_id = social_media.type
		WHERE public.member.member_id = $1
	`;

	const medias = await selectInfo(sqlQuery, [memberId]);
	sendResult(res, medias);
});

export default router;
