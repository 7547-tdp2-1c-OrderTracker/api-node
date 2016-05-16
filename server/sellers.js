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

var sellers = sequelize_endpoint(Seller);

var app = express();

app.put("/:seller_id/devices/register", promised(function(req) {
	return Device.register(req.params.seller_id, req.body);
}));

app.get("/:seller_id/reports", promised(function(req) {
	var now = req.query.date ? moment(req.query.date) : moment();
	var day_of_week = moment(now).day();

	var start, end;

	if (req.query.start_date) {
		start = moment(req.query.start_date);
	} else {
		var start = now.clone();
		start.set("hours",0)
		start.set("minutes",0)
		start.set("seconds",0)
	}

	if (req.query.end_date) {
		end = moment(req.query.end_date);
	} else {
		end = start.clone().add(1, 'day');
	}

	var seller_id = req.params.seller_id;
	return q.all([
		sequelize.query("SELECT COUNT(*) as count FROM (SELECT client_id FROM visits as v JOIN schedule_entries as s ON v.schedule_entry_id = s.id WHERE s.seller_id = ? AND v.date >= ? AND v.date <= ? AND day_of_week = ?) as clients", {
			replacements: [seller_id, start.toISOString(), end.toISOString(), day_of_week]
		}),
		sequelize.query("SELECT COUNT(*) as count FROM (SELECT client_id FROM visits as v JOIN schedule_entries as s ON v.schedule_entry_id = s.id WHERE s.seller_id = ? AND v.date >= ? AND v.date <= ? AND day_of_week != ?) as clients", {
			replacements: [seller_id, start.toISOString(), end.toISOString(), day_of_week]
		}),
		sequelize.query("SELECT SUM(total_price) as total, o.currency as currency FROM orders as o WHERE o.status = 'confirmed' AND o.seller_id = ? AND o.updated_at >= ? AND o.updated_at <= ? GROUP BY currency", {
			replacements: [seller_id, start.toISOString(), end.toISOString()]
		}),
		sequelize.query("SELECT COUNT(*) as count FROM orders as o WHERE o.status = 'confirmed' AND o.seller_id = ? AND o.updated_at >= ? AND o.updated_at <= ?", {
			replacements: [seller_id, start.toISOString(), end.toISOString()]
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
