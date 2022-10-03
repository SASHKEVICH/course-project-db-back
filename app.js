let express = require("express");
let config = require("./config/local.json");
let port = config.server.port;
let albumsRouter = require("./routes/albums");
let bodyParser = require("body-parser");

let app = express();

app.use("/albums", albumsRouter);

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
	console.log(`Example app listening on port ${port}`);
});
