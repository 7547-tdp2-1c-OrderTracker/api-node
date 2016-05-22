var express = require("express");
var app = express();
var q = require("q");
var sequelize = require("./domain/sequelize");
var Seller = require("./models/seller");
var moment = require("moment");

var promised = function(f) {
	return function(req, res) {
		q().then(function() {
				return f(req, res);
			})
			.then(function(value) {
				res.status(value.status).send(value.body);
			})
			.catch(function(err) {
				console.error(err.stack);

				if (typeof err !== "object") {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				} else if (!err.error) {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				}
				res.status(err.status||500).send(err);
			});
	};
};

var totalsQuery = "select s.id as id, s.name as name, s.lastname as lastname, SUM(o.total_price) as total from sellers as s join orders as o on o.seller_id = s.id where currency = ? and o.updated_at > ? and o.updated_at < ? group by s.id"

app.get("/sellers/top10", promised(function(req) {

	var processSeller = function(seller) {
		seller.total = parseInt(seller.total);
		return seller;
	};

	var year = req.query.year || moment().year().toString();

	var beginOfYear = moment(year + "0101");
	var endOfYear = beginOfYear.clone().add(1,'year');

	return sequelize.query("select id, name, lastname, total from (" + totalsQuery + ") as totals order by total DESC limit 10", {
		replacements: [req.query.currency || "ARS", beginOfYear.toISOString(), endOfYear.toISOString()]
	})
		.then(function(results) {
			return {
				body: {
					year: parseInt(year),
					top10: results[0].map(processSeller),
				},
				status: 200
			};
		});
}));

module.exports = app;