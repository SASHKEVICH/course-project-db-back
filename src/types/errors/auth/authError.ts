import { BackendError } from "../backendError";

export enum AuthErrorCodes {
	invalidCredentials = 511,
	allInputRequired = 512,
	userAlreadyExists = 513,
}

export class AuthError extends BackendError {
	code: AuthErrorCodes;

	constructor(message: string, code: AuthErrorCodes) {
		super(message, code);
		this.message = message;
		this.code = code;
	}
}