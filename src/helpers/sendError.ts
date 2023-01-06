import { Response } from "express";
import { BackendError } from "../types/errors/backendError";

function sendError(res: Response, error: BackendError) {
	res.status(error.code).json({
		error: "failure",
		message: error.message
	});
}

export default sendError;