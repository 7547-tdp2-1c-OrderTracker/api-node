var express = require("express");
var q = require("q");
var sequelize = require("./domain/sequelize");
var Sequelize = require("sequelize");

var Client = require("./models/client");
var Seller = require("./models/seller");
var ScheduleEntry = require("./models/schedule_entry");
var Order = require("./models/order");
var Visit = require("./models/visit");

var Config = require("./models/config");

var moment = require("moment");

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
app.post("/validate", promised(function(req) {

	//var client_id = parseInt(req.body.scan_result.split(";")[1]);
	var lat = parseFloat(req.body.lat);
	var lon = parseFloat(req.body.lon);
	var seller_id = req.body.seller_id;

	var client_id = req.body.client_id;
	var distance = req.body.distance ? parseFloat(req.body.distance) : 300;
	var now = req.body.date ? moment(req.body.date) : moment();

	var day_of_week = moment(now).day();

	var where = {};
	var attributes = null;

	return Config.get()
		.then(function(config) {

		console.log(config);

		if (!process.env.POSTGIS_DISABLED) {
			where = Sequelize.literal("ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT("+lat+" "+lon+")')) < " + config.client_max_distance);
			attributes = {
				include: [[Sequelize.literal("ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(" + lat + " " + lon + ")'))/1000"), "distance"]]
			}
		}

		return q.all([
			ScheduleEntry.findAll({
				where: {seller_id: seller_id, client_id: client_id},
				include: [
					{model: Seller},
					{model: Client, where: where, attributes: attributes}
				]
			}),
			Order.findAll({
				where: {seller_id: seller_id, client_id: client_id, status: 'draft'}
			})
		]).spread(function(schedule_entries, orders) {
			// si no tiene ningun schedule_entries, no lo tiene en la agenda y no puede marcarlo
			if (schedule_entries.length === 0){

				return q.all([
						Client.findOne({where: {id: client_id}}),
						Seller.findOne({where: {id: seller_id}}),
						ScheduleEntry.findOne({where: {seller_id: seller_id, client_id: client_id}})
					]).spread(function(client, seller, schedule_entry) {
						if (!seller) {
							throw {error: {key: 'QR_ERROR', value: "No existe seller con id " + seller_id}};
						}					
						if (!client) {
							throw {error: {key: 'QR_ERROR', value: "No existe client con id " + client_id}};
						}

						console.log(schedule_entry);

						if (!schedule_entry) {
							throw {error: {key: 'QR_ERROR', value: "client id:" + client_id + " y seller id: " + seller_id + " no estan asociados por agenda"}};
						}					

						throw {error: {key: 'QR_ERROR', value: "client id:" + client_id + " se encuentra a distancia mayor que la permitida: " + distance}};
					});

			}

			var schedule_entry = schedule_entries.sort(function(se1, se2) {
				return Math.abs(se1.day_of_week-day_of_week) - Math.abs(se2.day_of_week-day_of_week);
			})[0];

			return Visit.create({
				schedule_entry_id: schedule_entry.id,
				date: now.toDate(),
				comment: req.body.comment||''
			}, {authInfo: req.authInfo}).then(function() {
				if (orders.length) {
					return orders[0];
				} else {
					return Order.create({status: 'draft', seller_id: seller_id, client_id: client_id}, {authInfo: req.authInfo})
						.then(function(instance) {
							return instance.dataValues;
						});
				}
			}).then(function(order) {
				return {
					status: 200,
					body: {
						client: schedule_entry.client,
						order: order
					}
				};
			});

		});
	
	});

}));

module.exports = app;