var express = require("express");
var jwt = require("jsonwebtoken");

module.exports = function(secret) {
	var app = express();
	app.post("/login", function(req, res) {
		var token = jwt.sign({s:req.body.seller_id}, secret, {noTimestamp: true});
		res.status(200).send({
			token: token
		});
	});

	return app;
};
