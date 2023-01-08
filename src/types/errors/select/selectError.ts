import { BackendError } from "../backendError";

export enum SelectErrorCodes {
	notFoundAlbum = 460,
	notFoundBand = 461,
	notFoundSong = 462,
	notFoundGenre = 463,
	notFoundMember = 464,
}

export enum SelectCodes {
	Success = 200,
	Failure = 400
}

export class SelectError extends BackendError {
	message: string;
	code: SelectErrorCodes;

	constructor(message: string, code: SelectErrorCodes) {
		super(message, code);
		this.message = message;
		this.code = code;
	}
}