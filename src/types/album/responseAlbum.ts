import { album, genre } from "@prisma/client";

export type ResponseAlbum = {
	band: string;
	genres: genre[];
} & album;
