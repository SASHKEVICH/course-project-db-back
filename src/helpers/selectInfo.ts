import db from "../database/db";

const selectInfo = async (sqlQuery: string, params: Array<string>) => {
	try {
		const info = await db.any(sqlQuery, params);
		return { message: "success", info: info };
	} catch (err: any)
	{
		return { message: "failure", error: err.message };
	}
};

export default selectInfo;
