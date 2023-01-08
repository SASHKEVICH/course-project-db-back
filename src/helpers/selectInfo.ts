import db from "../database/db";

function select(sqlQuery: string, params: Array<any>) {

}

export async function selectOne<T>(sqlQuery: string, params: Array<any>): Promise<T> | never {
	try {
		const info: T = await db.one(sqlQuery, params);
		return info;
	} catch (err)
	{
		const error = err as Error;
		console.error(error.message)
		throw error;
	}
};

export async function selectMany<T>(sqlQuery: string, params: Array<any> = [""]): Promise<Array<T>> | never {
	try {
		const info: Array<T> = await db.any(sqlQuery, params);
		return info;
	} catch (err)
	{
		const error = err as Error;
		console.error(error.message)
		throw error;
	}
};

export default select;