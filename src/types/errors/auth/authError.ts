import { AuthErrorCodes } from "./authErrorCodes";

export class AuthError extends Error {
	message: string;
	code: AuthErrorCodes;

	constructor(message: string, code: AuthErrorCodes) {
		super()
		this.message = message;
		this.code = code;
	}
}