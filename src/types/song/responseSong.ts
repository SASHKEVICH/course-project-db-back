import { album, song } from "@prisma/client";

export type ResponseSong = {
	album: album
} & song;