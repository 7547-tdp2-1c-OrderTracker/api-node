var express = require("express");
var jwt = require("jsonwebtoken");
var sha1 = require("sha1");
var q = require("q");

var Seller = require("./models/seller");
var Admin = require("./models/admin");

module.exports = function(secret) {
	var app = express();
	app.post("/login", function(req, res) {
		var password = sha1(req.body.password);
		var email = req.body.email;

		q.all([
			Admin.findOne({where: {email: email, password: password}}),
			Seller.findOne({where: {email: email, password: password}})
		])
			.spread(function(admin, seller) {
				if (admin || seller) {
					var payload = {};
					if (admin) {
						payload.a = true;
					} else {
						payload.s = seller.get('id');
					}

					var token = jwt.sign(payload, secret, {noTimestamp: true});
					res.status(200).send({
						token: token,
						seller: seller && seller.dataValues,
						admin: admin && admin.dataValues
					});
				} else {
					throw {error: {key: 'LOGFAILED', value: 'email o password incorrecto'}, status: 401};
				}
			})
			.catch(function(err) {
				if (typeof err !== "object") {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				} else if (!err.error) {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				}
				res.status(err.status||500).send(err);
			});

	});

	app.get("/check", function(req, res) {
		if (req.authInfo && req.authInfo.admin) {
			res.status(200).send({ok: true});
		} else {
			res.status(403).send({error: {key: 'FORBIDDEN', value: "Chequeo fallado"}});
		}
	});

	return app;
};
