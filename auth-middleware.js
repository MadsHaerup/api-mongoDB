module.exports = function (request, response, next) {
	if (!request.headers.authorization) {
		response.status(401);
		response.end();
		return;
	}
	console.log(request.headers);

	if (request.headers.authorization != 'Bearer ' + process.env.TOKEN) {
		response.status(403);
		response.end();
		return;
	}
	next();
};
