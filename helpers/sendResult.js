const sendResult = (res, result) => {
	res.json({
		message: "success",
		data: result,
	});
};

module.exports = sendResult;
