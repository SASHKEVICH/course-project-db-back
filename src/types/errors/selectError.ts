import { SelectErrorCodes } from "./selectErrorCodes";

export class SelectError extends Error {
	message: string;
	code: SelectErrorCodes;

	constructor(message: string, code: SelectErrorCodes) {
		super()
		this.message = message;
		this.code = code;
	}
}