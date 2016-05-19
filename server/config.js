var sequelize_endpoint = require("./sequelize_endpoint");
var Config = require("./models/config");
var express = require("express");

var promised = function(f) {
	return function(req, res) {
		f(req, res)
			.then(function(value) {
				res.status(value.status).send(value.body);
			})
			.catch(function(err) {
				if (typeof err !== "object") {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				} else if (!err.error) {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				}
				res.status(err.status||500).send(err);
			});
	};
};


var app = express();

var returnConfig = function() {
	return Config.get()
		.then(function(config) {
			return {
				status:200,
				body: config
			};
		});
};

app.get("", promised(function(req) {
	return returnConfig();
}));

app.delete("", promised(function(req) {
	return Config.destroy({where: {}}, {authInfo: req.authInfo})
		.then(returnConfig);
}));

app.put("", promised(function(req) {
	var values = req.body;
	values.id = 1;

	return Config.findOne({where: {id: 1}})
		.then(function(config) {
			if (config) {
				return config.update(req.body, {authInfo: req.authInfo});
			} else {
				return Config.create(values, {authInfo: req.authInfo});
			}
		})
		.then(returnConfig);
}));

module.exports = app;
