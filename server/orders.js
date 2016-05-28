var express = require("express");
var sequelize = require("./domain/sequelize");
var q = require("q");

var sequelize_endpoint = require("./sequelize_endpoint");
var Order = require("./models/order");
var OrderItem = require("./models/order_item");
var Client = require("./models/client");
var Seller = require("./models/seller");
var Promotion = require("./models/promotion");

var default_product_picture = "http://www.higieneplus.com.ar/wp-content/themes/higieneplus/images/producto-sin-foto.jpg";

var filter_fields = ["status","client_id","seller_id"];
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

var mapOrderItem = function(entity) {
	if (!entity.thumbnail) {
		entity.thumbnail = default_product_picture;
	}

	entity.brand = entity.brand_name;
	return entity;
};

var orders = sequelize_endpoint(Order, {
	where: where,
	customCountQuery: function(req) {
		return Order.count({where: where(req)});
	},

	include: function(req) {
		return [{
			model: Client,
			where: req.query.clients_where ? JSON.parse(req.query.clients_where) : undefined,
			required: false
		},{
			model: OrderItem,
			where: req.query.order_items_where ? JSON.parse(req.query.order_items_where) : undefined,
			required: false
		},{
			model: Seller,
			where: req.query.sellers_where ? JSON.parse(req.query.sellers_where) : undefined,
			required: false
		}]
	},
	order: function(req) {
		if (req.query.order === "date_created") {
			return 'date_created DESC';
		}
		return "status DESC";
	},
	map: function(order) {
		if (order.order_items) order.order_items = order.order_items.map(mapOrderItem);
		return order;	
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
	include: [
		{model: Promotion, required: false, attributes: ["name", "percent", "min_quantity", "begin_date", "end_date"]}
	],
	map: mapOrderItem,
	postErrorHandler: function(err, req) {
		if (err.name !== 'SequelizeUniqueConstraintError') {
			throw err;
		}

		if (!req.body.quantity) throw {"error": {"key": "BAD_REQUEST", "value": "Falta parametro quantity"}, "status": 400};
		if (!req.body.product_id) throw {"error": {"key": "BAD_REQUEST", "value": "Falta parametro product_id"}, "status": 400};
		if (isNaN(parseInt(req.body.quantity))) throw {"error": {"key": "BAD_REQUEST", "value": "Parametro quantity no es un numero"}, "status": 400};

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
										}, {authInfo: req.authInfo});
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