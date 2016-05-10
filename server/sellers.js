var sequelize_endpoint = require("./sequelize_endpoint");
var Seller = require("./models/seller");
var express = require("express");
var Device = require("./models/device");

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

var sellers = sequelize_endpoint(Seller);

var app = express();

app.post("/:seller_id/devices/register", promised(function(req) {
	return Device.register(req.params.seller_id, req.body);
}));

app.use(sellers);

module.exports = app;
