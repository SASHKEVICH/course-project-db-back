import { BackendError } from "../backendError";

export enum SelectErrorCodes {
	notFoundAlbum = 460,
	notFoundBand = 461,
	notFoundSong = 462,
	notFoundGenre = 463,
	notFoundMember = 464,
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