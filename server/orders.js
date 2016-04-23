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

var pgTransaction = function(query, f) {
	var rollbackOnError = function(e) {
		return query("ROLLBACK").then(function() {
			throw e;
		});
	};

	var rollbackd = false;
	var rollback = function() {
		rollbackd = true;
		return query("ROLLBACK");
	};

	return f(query("BEGIN"), rollback)
				.then(function() {
					if (!rollbackd) {
						return query("COMMIT");
					}
				})
				.catch(rollbackOnError);
};

var convertOrder = function(order_entry) {
	return {
		id: order_entry.oe_id,
		product_id: order_entry.product_id,
		name: order_entry.name,
		brand_name: order_entry.brand_name,
		brand: order_entry.brand_name,
		quantity: order_entry.quantity,
		unit_price: order_entry.unit_price,
		currency: order_entry.oe_currency,
		thumbnail: order_entry.thumbnail,
		order_id: order_entry.id		
	};
};

var orderMapList = function(req, res) {
	return function(order) {
		return {
			id: order.id,
			delivery_date: order.delivery_date,
			status: order.status,
			total_price: order.total_price,
			currency: order.currency,
			client_id: order.client_id,
			vendor_id: order.vendor_id,
			date_created: order.date_created
		};
	};
};

var orderMapGet = function(req, res) {
	var f = orderMapList(req, res);
	return function(order, orders) {
		var ret = f(order);
		if (orders && orders.length && orders[0].product_id) {
			ret.order_items = orders.map(convertOrder);
		} else {
			ret.order_items = [];
		}
		return ret;
	};
};

var filter_fields = [["status","varchar"], ["client_id","int"], ["vendor_id","int"]];
var queryList = function(query, req, offset, limit) {
	var data = [offset, limit];
	var conditions = [" 1=1 "];
	var index = 3;

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
var orderQueryGet = "SELECT orders.id as id, delivery_date, date_created, orders.status as status, total_price, client_id, vendor_id, order_entries.id as oe_id, product_id, name, quantity, unit_price, orders.currency as currency, order_entries.currency as oe_currency, thumbnail, brand_name FROM orders LEFT JOIN order_entries ON orders.id = order_entries.order_id WHERE orders.id = $1::int";

var orders = pg_endpoint("orders", queryList, queryCount, orderQueryGet, orderMapList, orderMapGet, {
	fields: ["client_id", "vendor_id", "delivery_date", "status", "date_created"],
	_default: {
		status: function(){ return 'draft'; },
		date_created: function(){ return new Date().toISOString(); }
	}
});


mapList = function(req, res) {
	return function(order_entry) {
		return {
			id: order_entry.id,
			product_id: order_entry.product_id,
			name: order_entry.name,
			brand_name: order_entry.brand_name,
			brand: order_entry.brand_name,
			quantity: order_entry.quantity,
			unit_price: order_entry.unit_price,
			currency: order_entry.currency,
			thumbnail: order_entry.thumbnail,
			order_id: order_entry.order_id
		};
	};
};
mapGet = mapList;
queryList = function(query, req, offset, limit) {
	return query("SELECT * FROM order_entries WHERE order_id = $3::int OFFSET $1::int LIMIT $2::int", [offset, limit, req.params.order_id]);
};
queryCount = function(query, req) {
	return query("SELECT COUNT(*) FROM order_entries WHERE order_id = $1::int", [req.params.order_id]);
};
queryGet = "SELECT * FROM order_entries WHERE order_entries.id = $1::int";

var updateOrderTotalPrice = function(req, res, id) {
	return pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("select clients.seller_type from clients join orders on orders.client_id = clients.id where orders.id = $1::int", [req.params.order_id])
			.then(function(client) {
				if (!client.rows.length) return;

				var seller_type = client.rows[0].seller_type;
				var price_column;

				if (seller_type.slice(0,8) === "retail") {
					price_column = "retail_price";
				} else if (seller_type.slice(0,8) === "wholesal") {
					price_column = "wholesale_price";
				} else {
					return;
				}

				var denormalize = "update order_entries as oe set name = p.name, thumbnail = p.thumbnail, unit_price = p."+ price_column +", currency = p.currency," +
				" brand_name = b.name from products as p join brands as b on b.id = p.brand_id" +
				" where oe.id = $1::int and oe.product_id = p.id;";

				return query(denormalize, [id])
					.then(function() {
						var text = "UPDATE orders SET currency=(SELECT currency FROM order_entries WHERE order_id=$1::int LIMIT 1), total_price=(SELECT sum(unit_price * quantity) FROM order_entries WHERE order_id=$1::int) WHERE id=$1::int";
						return query(text, [req.params.order_id]);
					});
			})
			.finally(connection.done);
	});
};


var order_entries = pg_endpoint("order_entries", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["product_id", "quantity"],
	params_fields: ["order_id"],
	base: "/:order_id/order_items",
	afterCreate: updateOrderTotalPrice,
	afterUpdate: updateOrderTotalPrice,
	afterRemove: updateOrderTotalPrice
});

var stock_control = function(req, res, next) {
	// el control de stock solo se apica si el metodo es PUT y el status se cambia a confirmed
	if (req.method !== "PUT") return next();

	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		var nostock = false;
		return pgTransaction(query, function(tr, rollback) {
			return tr.then(function() {
				return query("SELECT * FROM orders WHERE status != 'confirmed' AND id = $1::int", [req.params.order_id])
					.then(function(result) {
						if (result.rows.length) {
							// la orden no esta confirmado, hay que chequear el stock
							return query("SELECT * FROM order_entries as oe JOIN products as p ON oe.product_id = p.id WHERE order_id = $1::int AND oe.quantity > p.stock", [req.params.order_id])
								.then(function(result) {
									if (result.rows.length) {
										// si hay registros, significa que hay items que exceden la disponibilidad del producto
										nostock = true;
										return rollback();
									} else {
										// si no devuelve registros, el stock esta bien , hay que actualizarlo y dejar 
										// que se actualize el status del order
										return query("UPDATE products as p SET stock=stock-oe.quantity FROM order_entries as oe WHERE p.id = oe.product_id AND oe.order_id = $1::int;", [req.params.order_id]);
									}
								});
						} else {
							// la orden esta confirmado, no se puede modificar
							throw new Error("Can't change confirmed order " + req.params.order_id + "\n");
						}
						
					});
			});
		})
			.finally(connection.done)
			.then(function() {
				if (nostock) {
					res.status(400).send(JSON.stringify({error: "NO_STOCK"}));
				} else {
					next();
				}
			})
			.catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
			});
	});
};

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

app.use("/:order_id", stock_control);
app.use("/:order_id", lock_order_items);
app.use("/:order_id/order_items", lock_order_items);

// PUT empty order
app.put("/:order_id/empty", function(req, res) {

	var mapF = orderMapGet(req, res);
	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("DELETE FROM order_entries WHERE order_id = $1::int", [req.params.order_id])
			.then(function() {
				return query("UPDATE orders SET currency=null, total_price=0 WHERE id=$1::int", [req.params.order_id]);
			})
			.then(function() {
				return query(orderQueryGet, [req.params.order_id]);
			})
			.finally(connection.done)
			.then(function(result) {
				if (result.rows && result.rows.length) {
					res.send(mapF(result.rows[0], result.rows));
				} else {
					res.status(404).send("Not found");
				}
			}).catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
			});
	});
});

app.use(orders);
app.use(order_entries);

module.exports = app;