var pg_endpoint = require("./pg_endpoint");
var express = require("express");
var pg = require("pg");
var q = require("q");

var pgConnect = q.denodeify(function(url, callback) {
	pg.connect(url, function(err, client, done) {
		callback(err, {
			client: client,
			done: done
		});
	});
});

var mapList = function(req, res) {
	return function(order) {
		return {
			id: order.id,
			delivery_date: order.delivery_date,
			status: order.status,
			total_price: order.total_price,
			client_id: order.client_id,
			vendor_id: order.vendor_id
		};
	}
};

var mapGet = mapList;
var queryList = function(query, req, offset, limit) {
	return query("SELECT * FROM orders OFFSET $1::int LIMIT $2::int", [offset, limit]);
};
var queryCount = function(query, req) {
	return query("SELECT COUNT(*) FROM orders");
};
var queryGet = "SELECT * FROM orders WHERE orders.id = $1::int";

var orders = pg_endpoint("orders", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["client_id", "date", "status", "total_price"]
});


mapList = function(req, res) {
	return function(order_entry) {
		return {
			id: order_entry.id,
			order_id: order_entry.order_id,
			product_id: order_entry.product_id,
			quantity: order_entry.quantity,
			price: order_entry.price
		};
	}
};
mapGet = mapList;
queryList = function(query, req, offset, limit) {
	return query("SELECT * FROM order_entries WHERE order_id = $3::int OFFSET $1::int LIMIT $2::int", [offset, limit, req.params.order_id]);
};
queryCount = function(query, req) {
	return query("SELECT COUNT(*) FROM order_entries WHERE order_id = $1::int", [req.params.order_id]);
};
queryGet = "SELECT * FROM order_entries WHERE order_entries.id = $1::int";

var order_entries = pg_endpoint("order_entries", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["product_id", "quantity", "price"],
	params_fields: ["order_id"],
	base: "/:order_id/order_items"
});

var lock_order_items = function(req, res, next) {
	if (req.method === "GET") return next();

	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));
		return query("SELECT * FROM orders WHERE id = $1::int", [req.params.order_id])
			.finally(connection.done)
			.then(function(result) {
				if (result.rows && result.rows.length > 0) {
					if (result.rows[0].status === "confirmed") {
						throw new Error("Can't change confirmed order " + req.params.order_id + "\n");
					}
				}
			});
	})
		.then(function() {
			next();
		}).catch(function(err) {
			console.error(err);
			res.status(401).send(err.toString());
		});
};

var app = express();

app.use("/:order_id", lock_order_items);
app.use("/:order_id/order_items", lock_order_items);
app.use(orders);
app.use(order_entries);

module.exports = app;