const sendJson = (res, json) => {
	res.json({
		message: "success",
		data: json,
	});
};

module.exports = sendJson;
