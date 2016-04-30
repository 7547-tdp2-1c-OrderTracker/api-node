var ScheduleEntry = require("./models/schedule_entry");
var Visit = require("./models/visit");
var Client = require("./models/client");
var moment = require("moment");
var Sequelize = require("sequelize");

var _ = require("underscore");

var express = require("express");
var q = require("q");

var schedules = express();

var promised = function(f) {
	return function(req, res) {
		q(f(req, res))
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

schedules.get("/day", promised(function(req, res) {
	var now = moment(req.query.date);
	var init_of_week = now.clone().subtract(moment(now).day(),'days');

	var day_of_week = moment(now).day();
	var where = {seller_id: req.query.seller_id, day_of_week: day_of_week};

	var clientOrder = "lastname DESC";
	var clientInclude = [];

	if (!process.env.POSTGIS_DISABLED) {
		if (req.query.lat && req.query.lon) {
			var lat = parseFloat(req.query.lat);
			var lon = parseFloat(req.query.lon);

			clientOrder = "ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(" + lat + " " + lon + ")'))";
			clientInclude = [[Sequelize.literal("ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(" + lat + " " + lon + ")'))/1000"), "distance"]];
		}
	}

	var include = [
		{model: Client, attributes: {include: clientInclude}},
		/* Solo cuentan las visitas que se haya producido esta semana */
		{model: Visit, where: {date: {$gte: init_of_week}}, required: false}
	];

	var getClient = function(schedule_entry) {
		var ret = schedule_entry.client.dataValues;

		if (schedule_entry.visits.length) {
			ret.visited = schedule_entry.visits[0].date;
		} else {
			ret.visited = null;
		}

		return ret;
	};

	return ScheduleEntry.findAll({where: where, include: include, order: clientOrder})
		.then(function(result) {
			return {status: 200, body: {
				seller_id: req.query.seller_id,
				date: req.query.date,
				clients: result.map(_.property("dataValues")).map(getClient)
			}};
		})
}));

module.exports = schedules;

