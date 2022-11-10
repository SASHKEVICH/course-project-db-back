import db from "../database/db";

const deleteInfo = async (sqlQuery: string) => {
	try {
		await db.result(sqlQuery);
		return { message: "success" };
	} catch (err: any)
	{
		return { message: "failure", error: err.message };
	}
};

export default deleteInfo;
