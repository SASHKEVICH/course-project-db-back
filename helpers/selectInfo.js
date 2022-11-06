import db from "../database/db.js";

const selectInfo = async (sqlQuery, params) => {
	try {
		const info = await db(sqlQuery, params);
		return { message: "success", info: info };
	} catch (err) {
		return { message: "failure", error: err.message };
	}
};

export default selectInfo;
