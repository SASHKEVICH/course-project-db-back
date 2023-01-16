import { album, genre, song, band } from "@prisma/client";

export type ResponseAlbum = {
	band: band[];
	genres?: genre[];
	songs?: song[];
} & album;
