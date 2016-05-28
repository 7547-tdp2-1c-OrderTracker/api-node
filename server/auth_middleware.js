var express = require("express");
var jwt = require("jsonwebtoken");
var Config = require("./models/config");
var Order = require("./models/order");

module.exports = function(secret) {
	return function(req, res, next) {
		if (req.path === "/v1/auth/login") return next();

		Config.get()
			.then(function(config) {
				if (config.auth_admin) {
					var authToken = req.headers.authorization || req.query.authorization;
					if (authToken) {
						jwt.verify(authToken, secret, function(err, decoded) {
							if (err) {
								res.status(403).send({error: {key: 'FORBIDDEN', value: err.toString()}});
							} else {
								req.authInfo = {admin_id: decoded.a, admin: !!decoded.a, seller_id: decoded.s};
								return next();
							}
						});
					} else {
						if (config.auth_seller) {
							res.status(403).send({error: {key: 'FORBIDDEN', value: "Falta header de authorization"}});
						} else {
							req.authInfo = {};
							if (req.params.seller_id) {
								req.authInfo = {seller_id: parseInt(req.params.seller_id)};
							}
							if (req.body.seller_id) {
								req.authInfo = {seller_id: parseInt(req.body.seller_id)};
							}
							if (req.query.seller_id) {
								req.authInfo = {seller_id: parseInt(req.query.seller_id)};
							}

							if(req.path.match("^/v1/orders")) {
								var order_id = req.path.split("/")[3];

								return Order.findOne({where: {id: order_id}})
									.then(function(order) {
										if (order) {
											req.authInfo = {seller_id: order.seller_id};
										}

										next();
									});
							}

							return next();
						}
					}
				} else {
					// si no tiene auth_admin, la seguridad esta desactivada
					req.authInfo = {admin: true};
					return next();
				}
			})
			.catch(function(err) {
				res.status(500).send({error: {key: 'INTERNAL_SERVER_ERROR', value: err.toString()}});
			});
	};
};