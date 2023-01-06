import { album, genre } from "@prisma/client";

export type AlbumWithBand = {
	band: string;
} & album;

export type ResponseAlbum = {
	album: AlbumWithBand;
	genres: genre[];
};
