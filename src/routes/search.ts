import { Router } from "express";
import selectInfo from "../helpers/selectInfo";
import sendResult from "../helpers/sendResult";

const router = Router();

router.get('/:request', async (req, res) => {
	const request = req.params.request.replace(/-/g, " ");
	const searchInAlbums = `
		SELECT album.album_id, album.title as title, band.title AS band, album.explicit
		FROM album 
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower('${request}')) > 0
	`

	const searchInBands = `
		SELECT band_id, title
		FROM band
		WHERE strpos(lower(title), lower('${request}')) > 0
	`

	const searchInSongs = `
		SELECT song.song_id, song.title AS title, album.title as album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE strpos(lower(song.title), lower('${request}')) > 0
	`
	const albums = await selectInfo(searchInAlbums, []);
	const bands = await selectInfo(searchInBands, []);
	const songs = await selectInfo(searchInSongs, []);
	const result = {
		"message": "success",
		"albums": albums.info,
		"bands": bands.info,
		"songs": songs.info
	};

	sendResult(res, result);
});

export default router;
