import express from "express";
const port = process.env.PORT;

import albumsRouter from "./routes/albums.js";
import songsRouter from "./routes/songs.js";
import bandsRouter from "./routes/bands.js";
import genresRouter from "./routes/genres.js";
import socialMediaRouter from "./routes/socialMedias.js";
import membersRouter from "./routes/members.js";

import pkg from "body-parser";
const { urlencoded, json } = pkg;

const app = express();

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/social_media", socialMediaRouter);
app.use("/members", membersRouter);

app.use(urlencoded({ extended: false }));
app.use(json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
