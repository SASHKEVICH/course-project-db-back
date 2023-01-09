import { band, member } from "@prisma/client"

export type ResponseMember = {
	currentBands?: band[]
} & member