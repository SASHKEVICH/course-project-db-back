const express = require("express");
const port = process.env.PORT;

let albumsRouter = require("./routes/albums");
let songsRouter = require("./routes/songs");
let bandsRouter = require("./routes/bands");
let genresRouter = require("./routes/genres");
let socialMediaRouter = require("./routes/socialMedias");
let membersRouter = require("./routes/members");

let bodyParser = require("body-parser");

const app = express();

app.use("/albums", albumsRouter);
app.use("/songs", songsRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/social_media", socialMediaRouter);
app.use("/members", membersRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
