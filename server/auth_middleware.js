var express = require("express");
var jwt = require("jsonwebtoken");

module.exports = function(secret, disabled) {
	return function(req, res, next) {
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