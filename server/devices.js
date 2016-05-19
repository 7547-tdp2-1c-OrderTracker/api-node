var Device = require("./models/device");
var express = require("express");
var sequelize_endpoint = require("./sequelize_endpoint")
var q = require("q");

var promised = function(f) {
	return function(req, res) {
		q()
			.then(function() {
				return f(req, res);
			})
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
var devices_crud = sequelize_endpoint(Device, {readonly: true, primaryKey: 'device_id'});

app.use("", devices_crud);

app.put("/:device_id", promised(function(req) {
	if (!req.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};

	return Device.register(req.body.seller_id, {
		device_id: req.params.device_id,
		registration_id: req.body.registration_id
	});
}));

app.post("", promised(function(req) {
	if (!req.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};
	if (!req.authInfo.admin) {
		if (req.body.seller_id !== req.authInfo.seller_id) {
            throw {error: {key: 'FORBIDDEN', value: 'no se puede registrar el dispositivo de ese vendedor'}, status: 403};
		}
	}

	return Device.register(req.body.seller_id, {
		device_id: req.body.device_id,
		registration_id: req.body.registration_id
	});
}));
module.exports = app;

