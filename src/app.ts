import express, { Express, Request, Response } from "express";
const port = process.env.PORT;

import albumsRouter from "./routes/albums"
import songsRouter from "./routes/songs"
import bandsRouter from "./routes/bands"
import genresRouter from "./routes/genres"
import socialMediaRouter from "./routes/socialMedias"
import membersRouter from "./routes/members"

import pkg from "body-parser";
const { urlencoded, json } = pkg;

const app: Express = express();

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/social_media", socialMediaRouter);
app.use("/members", membersRouter);

app.use(express.urlencoded());
app.use(express.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next();
});

// error handler
app.use(function (err: any, req: Request, res: Response) {
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
