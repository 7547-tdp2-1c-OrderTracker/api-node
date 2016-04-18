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

var convertOrder = function(order) {
	return {
		product_id: order.product_id,
		name: order.name,
		quantity: order.quantity,
		unit_price: order.price
	};
};

var mapList = function(req, res) {
	return function(order, orders) {
		var ret = {
			id: order.id,
			delivery_date: order.delivery_date,
			status: order.status,
			total_price: order.total_price,
			client_id: order.client_id,
			vendor_id: order.vendor_id
		};

		if (orders) {
			ret.order_items = orders.map(convertOrder);
		}

		return ret;
	}
};

var mapGet = mapList;
var queryList = function(query, req, offset, limit) {
	var data = [offset, limit];
	var conditions = [" 1=1 "];
	var index = 3;
	var filter_fields = [["status","varchar"], ["client_id","int"]];

	filter_fields.forEach(function(field) {
		var fieldName = field[0];
		var type = field[1];
		if (req.query[fieldName]) {
			conditions.push(" " + fieldName + "= $" + index + "::"+type+" ");
			data.push(req.query[fieldName]);
			index++;
		}
	});

	var strconditions = conditions.join(" AND ");
	var text = "SELECT * FROM orders WHERE "+ strconditions + "OFFSET $1::int LIMIT $2::int";
	return query(text, data);
};
var queryCount = function(query, req) {
	var data = [];
	var conditions = [" 1=1 "];
	var index = 1;
	var filter_fields = [["status","varchar"], ["client_id","int"]];

	filter_fields.forEach(function(field) {
		var fieldName = field[0];
		var type = field[1];
		if (req.query[fieldName]) {
			conditions.push(" " + fieldName + "= $" + index + "::"+type+" ");
			data.push(req.query[fieldName]);
			index++;
		}
	});

	var strconditions = conditions.join(" AND ");
	var text = "SELECT COUNT(*) FROM orders WHERE "+ strconditions;
	return query(text, data);
};
var queryGet = "SELECT orders.id as id, delivery_date, orders.status as status, total_price, client_id, vendor_id, order_entries.id as oe_id, product_id, quantity, price, name FROM orders JOIN order_entries ON orders.id = order_entries.order_id JOIN products ON order_entries.product_id = products.id WHERE orders.id = $1::int";

var orders = pg_endpoint("orders", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["client_id", "date", "status"]
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

var updateOrderTotalPrice = function(req, res) {
	return pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		var text = "UPDATE orders SET total_price=(SELECT sum(price) FROM order_entries WHERE order_id=$1::int) WHERE id=$1::int";
		return query(text, [req.params.order_id])
			.finally(connection.done);
	});
};


var order_entries = pg_endpoint("order_entries", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["product_id", "quantity", "price"],
	params_fields: ["order_id"],
	base: "/:order_id/order_items",
	afterCreate: updateOrderTotalPrice,
	afterUpdate: updateOrderTotalPrice
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