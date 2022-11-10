import db from "../database/db";

const updateInfo = async (sqlQuery: string) => {
	try {
		await db.result(sqlQuery);
		return { message: "success" };
	} catch (err: any)
	{
		return { message: "failure", error: err.message };
	}
};

export default updateInfo;