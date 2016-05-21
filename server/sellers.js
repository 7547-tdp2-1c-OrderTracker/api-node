var sequelize_endpoint = require("./sequelize_endpoint");
var sequelize = require("./domain/sequelize");
var Sequelize = require("sequelize");
var Seller = require("./models/seller");
var express = require("express");
var Device = require("./models/device");
var Visit = require("./models/visit");
var ScheduleEntry = require("./models/schedule_entry");
var moment = require("moment");
var q = require("q");

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

var hidePassword = function(entity) {
	delete entity.password;
	return entity;
};

var sellers = sequelize_endpoint(Seller, {map: hidePassword});

var app = express();

app.put("/:seller_id/devices/register", promised(function(req) {
	return Device.register(req.params.seller_id, req.body);
}));

app.get("/:seller_id/reports", promised(function(req) {
	var now;
	var day_of_week;

	var start, end;
	if (req.query.start_date || req.query.end_date) {
		now = moment(req.query.start_date);
		if (req.query.start_date) {
			start = moment(req.query.start_date);
		}
		if (req.query.end_date) {
			end = moment(req.query.end_date);
		}
	} else {
		now = moment();
		start = now.clone();
		start.set("hours",0)
		start.set("minutes",0)
		start.set("seconds",0)
	}

	day_of_week = moment(now).day();
	var date_condition, updated_at_condition, extra_params;

	// siempre va a haber o start, o end, o ambos (si no llega ni start_date ni end_date, toma la fecha de hoy)
	if (end) {
		if (start) {
			date_condition = "v.date >= ? AND v.date <= ?";
			updated_at_condition = "o.updated_at >= ? AND o.updated_at <= ?";
			extra_params = [start.toISOString(), end.toISOString()];
		} else {
			date_condition = "v.date <= ?";
			updated_at_condition = "o.updated_at <= ?";
			extra_params = [end.toISOString()];
		}
	} else {
		date_condition = "v.date >= ?";
		updated_at_condition = "o.updated_at >= ?";
		extra_params = [start.toISOString()];
	}

	var seller_id = req.params.seller_id;
	return q.all([
		sequelize.query("SELECT COUNT(*) as count FROM (SELECT client_id FROM visits as v JOIN schedule_entries as s ON v.schedule_entry_id = s.id WHERE s.seller_id = ? AND day_of_week = ? AND " + date_condition + " GROUP BY client_id) as clients", {
			replacements: [seller_id, day_of_week].concat(extra_params)
		}),
		sequelize.query("SELECT COUNT(*) as count FROM (SELECT client_id FROM visits as v JOIN schedule_entries as s ON v.schedule_entry_id = s.id WHERE s.seller_id = ? AND day_of_week != ? AND " + date_condition + " GROUP BY client_id) as clients", {
			replacements: [seller_id, day_of_week].concat(extra_params)
		}),
		sequelize.query("SELECT SUM(total_price) as total, o.currency as currency FROM orders as o WHERE o.status = 'confirmed' AND o.seller_id = ? AND " + updated_at_condition + " GROUP BY currency", {
			replacements: [seller_id].concat(extra_params)
		}),
		sequelize.query("SELECT COUNT(*) as count FROM orders as o WHERE o.status = 'confirmed' AND o.seller_id = ? AND " + updated_at_condition, {
			replacements: [seller_id].concat(extra_params)
		})

	]).spread(function(visits, out_of_route_visits, total_price, orders) {
		return {
			body: {
				range: {
					start: start,
					end: end
				},
				totals: {
					visits: parseInt(visits[0][0].count),
					out_of_route_visits: parseInt(out_of_route_visits[0][0].count),
					amount: total_price[0].map(function(x) {
						return {currency: x.currency, total: parseInt(x.total)};
					}),
					confirmed_orders: parseInt(orders[0][0].count)
				}
			},
			status: 200
		};
	})

}));

app.use(sellers);

module.exports = app;
