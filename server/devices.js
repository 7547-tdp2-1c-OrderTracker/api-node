var Device = require("./models/device");
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
app.put("/:device_id", promised(function(req) {
	return Device.register(req.body.seller_id, {
		device_id: req.params.device_id,
		registration_id: req.body.registration_id
	});
}));

app.put("", promised(function(req) {
	return Device.register(req.body.seller_id, {
		device_id: req.body.device_id,
		registration_id: req.body.registration_id
	});
}));
module.exports = app;

