const sendResult = (res, data) => {
	res.json({
		data,
	});
};

module.exports = sendResult;
