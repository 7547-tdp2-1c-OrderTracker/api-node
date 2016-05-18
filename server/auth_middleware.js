var express = require("express");
var jwt = require("jsonwebtoken");

module.exports = function(secret, disabled) {
	return function(req, res, next) {
		if (disabled) {
			if (req.query.authinfo_seller_id) {
				req.authInfo = {seller_id: req.query.authinfo_seller_id};
			} else {
				req.authInfo = {admin: true};
			}
			return next();
		}

		if (req.path === "/v1/auth/login") return next();

		if (!disabled || req.query.auth) {
			if (req.headers.authorization) {
				jwt.verify(req.headers.authorization, secret, function(err, decoded) {
					if (err) {
						res.status(403).send({error: {key: 'FORBIDDEN', value: err.toString()}});
					} else {
						req.authInfo = decoded;
						next();
					}
				});
			} else {
				res.status(403).send({error: {key: 'FORBIDDEN', value: "Missing 'authorization' header"}});
			}
		} else {
			next();
		}
	};
};