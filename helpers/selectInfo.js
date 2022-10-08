const db = require("../database/db");

const selectInfo = async (sqlQuery, params) => {
	try {
		const info = await db.any(sqlQuery, params);
		return { message: "success", info: info };
	} catch (err) {
		return { message: "failure", error: err.message };
	}
};

module.exports = selectInfo;
