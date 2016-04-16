var pg_endpoint = require("./pg_endpoint");

var mapList = function(req, res) {
	return function(order) {
		return {
			id: order.id,
			delivery_date: order.delivery_date,
			status: order.status,
			total_price: order.total_price
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
	fields: ["date", "status", "total_price"]
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
queryGet = "SELECT * FROM order_entries WHERE orders.id = $1::int";

var order_entries = pg_endpoint("order_entries", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["product_id", "quantity", "price"],
	params_fields: ["order_id"],
	base: "/:order_id/order_items"
});

var app = orders;
app.use(order_entries);

module.exports = app;