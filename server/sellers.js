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
		sequelize.query("SELECT COUNT(*) as count FROM visits as v JOIN schedule_entries as s ON v.schedule_entry_id = s.id WHERE s.seller_id = ? AND v.date >= ? AND v.date <= ?", {
			replacements: [seller_id, start.toISOString(), end.toISOString()]
		}),
		sequelize.query("SELECT COUNT(*) as count, o.currency as currency FROM orders as o WHERE o.status = 'confirmed' AND o.seller_id = ? AND o.updated_at >= ? AND o.updated_at <= ? GROUP BY currency", {
			replacements: [seller_id, start.toISOString(), end.toISOString()]
		})

	]).spread(function(visits, total_price) {
		return {
			body: {
				range: {
					start: start,
					end: end
				},
				totals: {
					visits: visits[0][0].count,
					amount: total_price[0].map(function(x) {
						return {currency: x.currency, count: parseInt(x.count)};
					})
				}
			},
			status: 200
		};
	})

}));

app.use(sellers);

module.exports = app;
