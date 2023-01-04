import express, { Express, Request, Response } from "express";

import albumsRouter from "./routes/albums"
import songsRouter from "./routes/songs"
import bandsRouter from "./routes/bands"
import genresRouter from "./routes/genres"
import socialMediaRouter from "./routes/socialMedias"
import membersRouter from "./routes/members"
import searchRouter from "./routes/search"

import registrationRouter from "./routes/user/registraion"
import loginRouter from "./routes/user/login"

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/social_media", socialMediaRouter);
app.use("/members", membersRouter);
app.use("/search", searchRouter);
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next) {
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
