import { AuthErrorCodes } from "./auth/authError";
import { SelectErrorCodes } from "./select/selectError";

type BackendErrorCodes = AuthErrorCodes | SelectErrorCodes;

export class BackendError extends Error {
	message: string;
	code: BackendErrorCodes;

	constructor(message: string, code: BackendErrorCodes) {
		super()
		this.message = message;
		this.code = code;
	}
}