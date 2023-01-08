import { Response } from "express";
import { SelectCodes } from "../types/errors/select/selectError";

const sendResult = (res: Response, data: any) => {
	res.status(SelectCodes.Success).json(data);
};

export default sendResult;
