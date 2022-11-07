import { Response } from "express";

const sendResult = (res: Response, data: any) => {
	res.json({
		data,
	});
};

export default sendResult;
