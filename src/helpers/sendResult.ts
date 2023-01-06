import { Response } from "express";

const sendResult = (res: Response, data: any) => {
	res.status(200).json(data);
};

export default sendResult;
