var express = require("express");
var sequelize = require("./domain/sequelize");
var q = require("q");

var sequelize_endpoint = require("./sequelize_endpoint");
var Order = require("./models/order");
var OrderItem = require("./models/order_item");
var Client = require("./models/client");


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
	where: where,
	include: [{
		model: Client
	},{
		model: OrderItem
	}],
	order: function() {
		return "status DESC";
	}
});

var order_entries = sequelize_endpoint(OrderItem, {
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
	},
	postErrorHandler: function(err, req) {
		if (err.name !== 'SequelizeUniqueConstraintError') {
			throw err;
		}

		return sequelize.query("SELECT stock FROM order_entries as oe JOIN products as p ON oe.product_id = p.id WHERE p.stock >= ? + oe.quantity AND oe.order_id = ?",
				{replacements: [req.body.quantity, req.params.order_id], type: sequelize.QueryTypes.SELECT})
					.then(function(products) {
						if (products.length) {
							// si hay registros, es porque hay stock suficiente del producto (la cant que ya tenia mas la q se agrega)
							return OrderItem.findOne({where: {product_id: req.body.product_id, order_id: req.params.order_id}})
								.then(function(order_item) {
									if (order_item) {
										return order_item.update({
											quantity: parseInt(order_item.get('quantity')) + parseInt(req.body.quantity)
										});
									}
								});
						} else {
							// en caso contrario hay q devolver un error
							throw {"error":{"key":"NO_STOCK","value":"No se puede incrementar la cantidad del item, no hay suficiente stock del producto"},"status":400}
						}
					});
	}
});

var app = express();

// PUT empty order
app.put("/:order_id/empty", function(req, res) {
	Order.empty(req.params.order_id)
		.then(function(result) {
			res.status(200).send(result);
		})
		.catch(function(err) {
			res.status(500).send(err);
		});
});

app.use(orders);
app.use(order_entries);

module.exports = app;