import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";

const router = Router();

/* GET songs in album by title and band*/
router.get("/album=:title&band=:band", async (req, res) => {
	const album: string = req.body.title.replace(/-/g, " ")
	const band: string = req.body.band.replace(/-/g, " ")

	const selectAlbumId = `
		SELECT album.album_id 
		FROM album
		LEFT JOIN "album/band" alband ON alband.album_id = album.album_id
		LEFT JOIN band ON band.band_id = alband.band_id
		WHERE strpos(lower(album.title), lower($1)) > 0 
			AND strpos(lower(band.title), lower($2)) > 0
	`;

	const selectSongs = `
		SELECT song.song_id, song.title AS song, album.title AS album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	const albums = await selectInfo(selectAlbumId, [album, band]);
	const albumId = albums.info?.map((e) => e.album_id)[0];
	const songs = await selectInfo(selectSongs, albumId);
	sendResult(res, songs);
});

/* GET songs in album by id*/
router.get("/albumId=:album_id", async (req, res) => {
	const albumId = req.params.album_id;

	const selectSongs = `
		SELECT song.song_id, song.title AS song, album.title AS album
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	const songs = await selectInfo(selectSongs, [albumId]);
	sendResult(res, songs);
});

export default router;
