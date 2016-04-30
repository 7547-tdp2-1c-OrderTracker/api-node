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
	var now = req.query.date ? moment(req.query.date) : moment();
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
				date: req.query.date || now.toISOString(),
				clients: result.map(_.property("dataValues")).map(getClient)
			}};
		})
}));


schedules.get("/week", promised(function(req, res) {
	var now = req.query.date ? moment(req.query.date) : moment();

	var where = {seller_id: req.query.seller_id};
	var day_of_week = moment(now).day();
	var init_of_week = now.clone().subtract(day_of_week,'days');

	var order = 'day_of_week ASC';
	// esta vez no necesitamos joinear a clientes, porque no vamos a devolver informacion de clientes en este
	// endpoint, pero si necesitamos visit
	var include = [{
		/* solo nos importan las visitas que hayan ocurrido esta semana */
		model: Visit, where: {date: {$gte: init_of_week}}, required: false
	}];

	var isRed = function(schedule_entry) {
		// los schedule_entry del dia actual nunca son rojos
		if (schedule_entry.day_of_week === day_of_week) return false;

		if (schedule_entry.visits && schedule_entry.visits.length) {
			// si el schedule_entry tiene visitas, entonces no es rojo
			return false;
		} else {
			return true;
		}
	};
	var isGreen = function(schedule_entry) {
		if (schedule_entry.visits && schedule_entry.visits.length) {
			return true;
		} else {
			// un schedule entry nunca puede ser green si no tuvo ninguna visita en la semana
			return false;
		}
	};

	var getSemaphore = function(schedule_entries) {
		return function(day_of_week) {
			var is_from_today = function(schedule_entry) {
				return schedule_entry.get("day_of_week") === day_of_week;
			};
			var current = schedule_entries.filter(is_from_today);

			var red = current.filter(isRed).length;
			var green = current.filter(isGreen).length;
			return {
				date: init_of_week.clone().add(day_of_week, 'days').toISOString(),
				day_of_week: day_of_week,
				red: red,
				green: green,
				yellow: current.length - red - green
			};
		};
	};

	return ScheduleEntry.findAll({where: where, order: order, include: include})
		.then(function(result) {
			return {
				status: 200, 
				body: {
					seller_id: req.query.seller_id,
					date: req.query.date || now.toISOString(),
					semaphore: [0,1,2,3,4,5,6].map(getSemaphore(result))
				}};
		});

}));

module.exports = schedules;

