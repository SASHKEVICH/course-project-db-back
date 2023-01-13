import { Router } from "express";
import { band, member } from "@prisma/client";
import { ResponseAlbum } from "../types/album/responseAlbum";
import { ResponseSong } from "../types/song/responseSong";
import { selectMany } from "../helpers/selectInfo";
import sendResult from "../helpers/sendResult";

const router = Router();

type SearchResponse = {
	albums: ResponseAlbum[],
	bands: band[],
	songs: ResponseSong[],
	members: member[],
};

router.get('/:request', async (req, res) => {
	console.log("--GET search");
	const request: string = req.params.request.replace(/-/g, " ");
	const searchInAlbums = `
		SELECT 
			album.album_id, 
			album.album_cover_path,
			album.title, 
			album.explicit,
			json_agg(json_build_object(
				'band_id', band.band_id,
				'title', band.title
			)) as band
		FROM album 
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower('${request}')) > 0
		GROUP BY album.album_id
	`;

	const searchInBands = `
		SELECT 
			band_id,
			title, 
			photo_path
		FROM band
		WHERE strpos(lower(title), lower('${request}')) > 0
	`;

	const searchInSongs = `
		SELECT 
			song.song_id,
			song.title AS title,
			json_agg(json_build_object(
				'album_id', album.album_id,
				'title', album.title,
				'cover', album.album_cover_path
			)) as album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE strpos(lower(song.title), lower('${request}')) > 0
		GROUP BY song.song_id
	`;

	const membersRequest = request.replace(/ /g, "|");
	const searchInMembers = `
		SELECT 
			member_id AS id, 
			name, 
			photo_path FROM member
		WHERE lower(name COLLATE "en_US") ~ '${membersRequest}';
	`;

	try {
		const albums: ResponseAlbum[] = await selectMany<ResponseAlbum>(searchInAlbums);
		const bands: band[] = await selectMany<band>(searchInBands);
		const songs: ResponseSong[] = await selectMany<ResponseSong>(searchInSongs);
		const members: member[] = await selectMany<member>(searchInMembers);

		const result: SearchResponse = {
			albums: albums,
			bands: bands,
			songs: songs,
			members: members
		};

		sendResult(res, result);
	} catch (e) {
		console.error(e)
	}
});

export default router;
