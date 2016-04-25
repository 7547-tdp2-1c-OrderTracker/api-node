var express = require("express");
var pg = require("pg");
var q = require("q");

var sequelize_endpoint = require("./sequelize_endpoint");
var Order = require("./models/order");
var OrderEntry = require("./models/order_entry");

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

var filter_fields = ["status","client_id","vendor_id"];
var where = function(req) {
	var filters = filter_fields.filter(function(fieldName) {
		return req.query[fieldName];
	}).map(function(fieldName) {
		var ret = {};
		ret[fieldName] = {$in: req.query[fieldName].split(",")};

		return ret;
	});

	if (filters.length) {
		return {$and: filters};
	} else {
		return {};
	}
};

var orders = sequelize_endpoint(Order, {
	where: where
});

var order_entries = sequelize_endpoint(OrderEntry, {
	base: "/:order_id/order_items",
	where: function(req) {
		return {order_id: req.params.order_id};
	},
	extra_fields: {
		order_id: function(req) {
			return req.params.order_id;
		}
	},
	map: function(entity) {
		entity.brand = entity.brand_name;
		return entity;
	}
});

var stock_control = function(req, res, next) {
	// el control de stock solo se apica si el metodo es PUT y el status se cambia a confirmed
	if (req.method !== "PUT") return next();
	if (req.url !== "/") return next();

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
							// la orden esta confirmado, no se puede modificar, a menos que sea poner el status en confirmed
							if (req.body.status !== "confirmed" || Object.keys(req.body).length !== 1) {
								throw new Error("Can't change confirmed order " + req.params.order_id + "\n");
							}
						}
						
					});
			});
		})
			.finally(connection.done)
			.then(function() {
				if (nostock) {
					res.status(400).send({error: "NO_STOCK"});
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
	if (req.url !== "/") return next();

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

var prevent_stock_surpass_on_update = function(req, res, next) {
	if (req.method !== "PUT") return next();
	// si no se cambia el quantity, no hay que chequear nada
	if (!req.body.quantity) return next();

	var nostock = false;
	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("SELECT stock FROM order_entries as oe JOIN products as p ON oe.product_id = p.id WHERE p.stock >= $1::int AND oe.id = $2::int", [req.body.quantity, req.params.order_entry_id])
				.finally(connection.done)
				.then(function(result) {
					if (!result.rows.length) {
						// si no hay registros, significa que no hay stock del producto
						nostock = true;
					}
				})
	})
		.then(function() {
			if (nostock) {
				res.status(400).send({error: "NO_STOCK"});
			} else {
				next();
			}
		}).catch(function(err) {
			console.error(err);
			res.status(401).send(err.toString());
		});	
};

var prevent_stock_surpass = function(req, res, next) {
	if (req.method !== "POST") return next();
	if (!req.body.product_id) return next();
	if (!req.body.quantity) return next();

	var nostock = false;
	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("SELECT stock FROM products WHERE stock >= $1::int AND id = $2::int", [req.body.quantity, req.body.product_id])
				.finally(connection.done)
				.then(function(result) {
					if (!result.rows.length) {
						// si no hay registros, significa que no hay stock del producto
						nostock = true;
					}
				})
	})
		.then(function() {
			if (nostock) {
				res.status(400).send({error: "NO_STOCK"});
			} else {
				next();
			}
		}).catch(function(err) {
			console.error(err);
			res.status(401).send(err.toString());
		});
};

var draft_limit = function(req, res, next) {
	if (req.method !== "POST") return next();
	if (!req.body.client_id) return next();

	var draft_limit_reached = false;

	pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("SELECT client_id FROM orders as o WHERE o.status = 'draft' AND o.client_id = $1::int", [req.body.client_id])
				.finally(connection.done)
				.then(function(result) {
					if (result.rows.length) {
						// si hay registros, significa que ya hay pedidos en draft de ese cliente
						draft_limit_reached = true;
					}
				})
	})
		.then(function() {
			if (draft_limit_reached) {
				res.status(400).send(JSON.stringify({error: "DRAFT_LIMIT_REACHED"}));
			} else {
				next();
			}
		}).catch(function(err) {
			console.error(err);
			res.status(401).send(err.toString());
		});

};


var app = express();

app.use("", draft_limit);

app.use("/:order_id", stock_control);
app.use("/:order_id", lock_order_items);

app.use("/:order_id/order_items/:order_entry_id", prevent_stock_surpass_on_update);
app.use("/:order_id/order_items", prevent_stock_surpass);
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