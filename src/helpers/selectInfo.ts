import db from "../database/db";

const selectInfo = async (sqlQuery: string, params: Array<any>) => {
	try {
		const info = await db.any(sqlQuery, params);
		return { message: "success", info: info };
	} catch (err: any)
	{
		console.log(err.message)
		return { message: "failure", error: err.message };
	}
};

export default selectInfo;
