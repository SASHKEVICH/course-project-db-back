import { album, genre } from "@prisma/client";

export enum AlbumCodes {
	Success = 200,
	Failure = 400
}

export type ResponseAlbum = {
	band: string;
	genres?: genre[];
} & album;
