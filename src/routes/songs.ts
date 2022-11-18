import { Router } from "express";
import sendResult from "../helpers/sendResult";
import selectInfo from "../helpers/selectInfo";
import insertInfo from "../helpers/insertInfo";
import deleteInfo from "../helpers/deleteInfo";
import updateInfo from "../helpers/updateInfo";

const router = Router();

/* GET songs in album by title and band*/
router.get("/album=:title&band=:band", async (req, res) => {
	// @ts-ignore
	const album: string = req.params.title.replace(/-/g, " ");
	// @ts-ignore
	const band: string = req.params.band.replace(/-/g, " ");

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
router.get("/", async (req, res) => {
	const selectSongs = `
		SELECT song_id, duration, title
		FROM song
	`;

	const songs = await selectInfo(selectSongs, []);
	sendResult(res, songs);
});

/* GET songs in album by id*/
router.get("/albumId=:album_id", async (req, res) => {
	const albumId = req.params.album_id;

	const selectSongs = `
		SELECT song.song_id, song.duration, song.title AS title
		FROM album
		LEFT JOIN "album/song" alsong ON alsong.album_id = album.album_id
		LEFT JOIN song ON song.song_id = alsong.song_id
		WHERE album.album_id = $1
		ORDER BY alsong.order ASC
	`;

	const songs = await selectInfo(selectSongs, [albumId]);
	sendResult(res, songs);
});

/* CREATE song */
router.post("/", async (req, res) => {
	const parsedData = req.body;
	const insertSong = `
		INSERT INTO song
		VALUES (DEFAULT, '${parsedData.title}', ${parsedData.isExplicit}, '${parsedData.duration}') RETURNING song_id
	`
	const songId = await insertInfo(insertSong);
	sendResult(res, songId);
});

/* UPDATE song */
router.put("/", async (req, res) => {
	const parsedData = req.body;
	const insertSong = `
		UPDATE song
		SET 
		  title = '${parsedData.title}', 
		  explicit = ${parsedData.isExplicit}, 
			duration = '${parsedData.duration}'
		WHERE song_id = '${parsedData.songId}'
	`
	const result = await updateInfo(insertSong);
	sendResult(res, result);
});


/* DELETE song */
router.delete("/id=:id", async (req, res) => {
	const songId = req.params.id;
	
	const deleteSong = `
		DELETE FROM song WHERE song_id = ${songId}
	`
	const result = await deleteInfo(deleteSong);
	sendResult(res, result);
});

export default router;
