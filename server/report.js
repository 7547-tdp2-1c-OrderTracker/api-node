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


var monthSalesQuery = ["select count(*) as orders_amount, coalesce(sum(coalesce(total_price, 0)),0) as amount",
"from orders as o join sellers as s on o.seller_id = s.id",
"where o.currency = ? and o.updated_at > ? and o.updated_at < ?"].join(" ");


app.get("/monthSales", promised(function(req) {

	var now = moment();
	var date = req.query.date || now.format("MM-YYYY");
	var years = req.query.years ? JSON.parse(req.query.years) : [now.year(), now.year()-1];
	var seller_id = parseInt(req.query.seller_id);
	var currency = req.query.currency || "ARS";

	var queryAmount = function(range) {
		return sequelize.query(monthSalesQuery +  (seller_id ? "and s.id = ?": ""), {
			replacements: seller_id ? [currency, range.begin, range.end, seller_id] : [currency, range.begin, range.end]
		})
			.then(function(d) {
				return {data: d, range: range}
			});
	};

	var processReport = function(report) {
		return {
			year: report.range.year,
			amount: parseInt(report.data[0][0].amount),
			orders_amount: parseInt(report.data[0][0].orders_amount)
		};
	};


	var ranges = years.map(function(year) {
		var beginDate = moment(date, "MM-YYYY");
		beginDate.year(year);
		var endDate = beginDate.clone().add(1, 'month');

		return {
			begin: beginDate.toISOString(),
			end: endDate.toISOString(),
			year: year
		};
	})

	return q.all(ranges.map(queryAmount))
		.then(function(report) {
			var body = {
				currency: currency,
				month: date,
				report: report.map(processReport)
			};

			if (seller_id) body.seller_id = seller_id;

			return {
				body: body,
				status: 200
			};
		});

}));


var brandsSalesQuery = [
"select b.id, b.name, b.picture, b.code, sum(oe.unit_price * oe.quantity) as total_amount, count(*) as items_amount",
"from order_entries as oe join products as p on oe.product_id = p.id join brands as b on p.brand_id = b.id join orders as o on oe.order_id = o.id",
"where oe.currency = ? and o.updated_at > ? and o.updated_at < ?",
"group by b.id"
].join(" ");

app.get("/brandsSales", promised(function(req) {
	var processBrand = function(brand) {
		return {
			brand: {
				id: brand.id,
				name: brand.name,
				code: brand.code,
				picture: brand.picture
			},
			total_amount: parseInt(brand.total_amount),
			items_amount: parseInt(brand.items_amount)
		};
	};

	var date = req.query.date || moment().format("MM-YYYY");
	var beginDate = moment(date, "MM-YYYY");
	var endDate = beginDate.clone().add(1, 'month');
	var currency = req.query.currency || "ARS";

	return sequelize.query(brandsSalesQuery, {replacements: [req.query.currency || "ARS", beginDate.toISOString(), endDate.toISOString()]})
		.then(function(results) {
			return {
				body: {
					currency: currency,
					date: date,
					report: results[0].map(processBrand)
				},
				status: 200
			};
		});
}));

var totalsQuery = "select s.id as id, s.name as name, s.lastname as lastname, SUM(o.total_price) as total from sellers as s join orders as o on o.seller_id = s.id where currency = ? and o.updated_at > ? and o.updated_at < ? group by s.id"

app.get("/sellers/top10", promised(function(req) {

	var processSeller = function(seller) {
		seller.total = parseInt(seller.total);
		return seller;
	};

	var year = req.query.year || moment().year().toString();
	var currency = req.query.currency || "ARS";

	var beginOfYear = moment(year + "0101");
	var endOfYear = beginOfYear.clone().add(1,'year');

	return sequelize.query("select id, name, lastname, total from (" + totalsQuery + ") as totals order by total DESC limit 10", {
		replacements: [currency, beginOfYear.toISOString(), endOfYear.toISOString()]
	})
		.then(function(results) {
			return {
				body: {
					currency: currency,
					year: parseInt(year),
					top10: results[0].map(processSeller),
				},
				status: 200
			};
		});
}));

module.exports = app;