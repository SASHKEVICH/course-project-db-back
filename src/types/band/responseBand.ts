import { band, genre, album, member } from "@prisma/client";

export type ResponseBand = {
	members?: member[]
	albums?: album[]
	genres?: genre[]
} & band;