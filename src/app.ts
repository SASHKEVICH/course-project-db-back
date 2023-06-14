import express, { Express, Request, Response } from "express";

import albumsRouter from "./routes/albums";
import songsRouter from "./routes/songs";
import bandsRouter from "./routes/bands";
import genresRouter from "./routes/genres";
import membersRouter from "./routes/members";
import searchRouter from "./routes/search";

import registrationRouter from "./routes/auth/registraion";
import loginRouter from "./routes/auth/login";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/members", membersRouter);
app.use("/search", searchRouter);
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next) {
	res.status(404).send("Incorrect route");
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

app.get("/test", function (req, res) {
	res.status(200).json({
		data: "test successfully",
	});
});

export default app;
