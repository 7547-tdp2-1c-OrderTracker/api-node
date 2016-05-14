var express = require("express");
var jwt = require("jsonwebtoken");

module.exports = function(secret) {
	var app = express();
	app.post("/login", function(req, res) {
		var payload = {};
		if (req.body.admin) {
			payload.a = true;
		} else {
			payload.s = req.body.seller_id;
		}

		var token = jwt.sign(payload, secret, {noTimestamp: true});
		res.status(200).send({
			token: token
		});
	});

	return app;
};
