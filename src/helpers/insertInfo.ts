import db from "../database/db";

const insertInfo = async (sqlQuery: string) => {
	try {
		const entityId = await db.one(sqlQuery, []);
		return { message: "success", entityId: entityId };
	} catch (err: any)
	{
		return { message: "failure", error: err.message };
	}
};

export default insertInfo;
