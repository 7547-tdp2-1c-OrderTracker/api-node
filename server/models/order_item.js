var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var q = require("q");
var moment = require("moment");

var Order = require("./order");
var Product = require("./product");
var Client = require("./client");
var Brand = require("./brand")
var Promotion = require("./promotion");

var updateOrderTotalPrice = function(instance, options) {
	var order_id = instance.order_id;
	var order_entry_id = instance.id;

	var updateTotals = "UPDATE orders SET currency=?, total_price=(SELECT coalesce(sum(unit_price * quantity),0) FROM order_entries WHERE order_id=?) WHERE id=?"
	return Order.find({where: {id: order_id}, include: [{model: Client}]})
		.then(function(order) {

			if (!order.get("client")) {
				throw {error: {key: 'BAD_REQUEST', value: "no se pùede modificar un pedido sin cliente asociado"}, status: 400};
			}

			var seller_type = order.get("client").get('sellerType');
			var price_column;

			if (seller_type.slice(0,8) === "retail") {
				price_column = "retailPrice";
			} else if (seller_type.slice(0,8) === "wholesal") {
				price_column = "wholesalePrice";
			} else {
				return;
			}

			var now = moment();
			var include = [{
				model: Brand,
				attributes: ['id', 'name'],
				include: [{
					model: Promotion,
					where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}, min_quantity: {$lte: instance.quantity}},
					required: false,
					attributes: ['id', 'percent']
				}]
			}, {
				model: Promotion,
				where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}, min_quantity: {$lte: instance.quantity}},
				required: false,
				attributes: ['id', 'percent']
			}];

			var order = [
				[Promotion, "percent", "DESC"],
				[Brand, Promotion, "percent", "DESC"]
			];

			return Product.findOne({order: order, where: {id: instance.product_id}, include: include})
				.then(function(product) {
					if (!product) return;

					var brand_promotions = product.get('brand').get('promotions');
					var product_promotions = product.get('promotions');
					var promotion_id = null;

					var percent_discount = 0;
					if (brand_promotions.length > 0) {
						percent_discount = brand_promotions[0].get('percent');
						promotion_id = brand_promotions[0].get('id');
					}
					if (product_promotions.length > 0) {
						if (product_promotions[0].get('percent') > percent_discount) {
							percent_discount = product_promotions[0].get('percent');
							promotion_id = product_promotions[0].get('id');
						}
					}

					return instance.update({
						promotion_id: promotion_id,
						unit_price: product.get(price_column) * (100-percent_discount)/100,
						currency: product.get("currency"),
						thumbnail: product.get("thumbnail")||product.get("picture"),
						name: product.get("name"),
						brand_name: product.get("brand").get("name")
					}, {hooks: false})
						.then(function() {
							return sequelize.query(updateTotals, {
								replacements: [product.get("currency"), order_id, order_id]
							})							
						});
				});

		});
};

var validateConfirmed = function(order_id, errormsg) {
	return Order.findOne({where: {id: order_id, status: 'draft'}})
		.then(function(result) {
			// si no devuelve resultados, es porque el pedido no esta confirmado y no 
			// se permite modificar el item
			if (!result) {
				throw {error: {key: 'ALREADY_CONFIRMED', value: errormsg}, status: 400}
			}
		});
};

var stockControl = function(product_id, quantity, order_id, order_entry_id) {

	if (isNaN(parseInt(quantity))) {
		throw {"error": {"key": "BAD_REQUEST", "value": "Parametro quantity no es un numero"}, "status": 400};
	}

	return sequelize.query("SELECT coalesce(SUM(oe.quantity),0) as total_quantity FROM order_entries as oe JOIN orders as o ON oe.order_id = o.id WHERE oe.id != ?",
		{replacements: [order_entry_id]})
		.then(function(total) {
			var newTotal = parseInt(quantity) + parseInt(total[0][0].total_quantity);

			return Product.findOne({where: {id: product_id, stock: {$gte: newTotal}}})
				.then(function(result) {
					// si no devuelve resultados, significa que no hay stock suficiente del producto
					if (!result) {
						throw {error: {key: 'NO_STOCK', value: "No hay suficientes unidades del producto"}, status: 400}
					}
				});
		});
};

var beforeUpdate = function(instance, options) {
	sequelize.checkAllowed(["quantity"], options);

	var order_id = instance.get('order_id');

	return Order.findOne({where: {id: order_id}})
		.then(function(order) {
			sequelize.onlySeller(order, options);

			return validateConfirmed(order_id, "solo se puede modificar un pedido que este en borrador")
				.then(function() {
					return stockControl(instance.get('product_id'), instance.get('quantity'), order_id, instance.get('id'));
				});
		});
};

var beforeCreate = function(instance, options) {
	var order_id = instance.get('order_id');
	return Order.findOne({where: {id: order_id}})
		.then(function(order) {
			sequelize.onlySeller(order, options);

			return validateConfirmed(order_id, "solo se puede modificar un pedido que este en borrador")
				.then(function() {
					return stockControl(instance.get('product_id'), instance.get('quantity'), order_id)
				});
		});
};

var OrderItem = sequelize.define('order_items', {
  name: Sequelize.STRING,
  brand_name: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  quantity: {
  	type: Sequelize.INTEGER,
  	validate: {
  		isInt: true,
  		min: 1
  	}
  },
  unit_price: Sequelize.INTEGER,
  order_id: Sequelize.INTEGER,
  product_id: Sequelize.INTEGER,
  currency: Sequelize.STRING(4),
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  tableName: 'order_entries',
  hooks: {
  	beforeUpdate: beforeUpdate,
  	beforeCreate: beforeCreate,
  	afterCreate: updateOrderTotalPrice,
  	afterDestroy: updateOrderTotalPrice,
  	afterUpdate: updateOrderTotalPrice
  },
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

OrderItem.belongsTo(Order, {foreignKey: 'order_id'});
Order.hasMany(OrderItem, {foreignKey: 'order_id'});

OrderItem.belongsTo(Product, {foreignKey: 'product_id'});
OrderItem.belongsTo(Promotion, {foreignKey: 'promotion_id'});

Order.empty = function(order_id) {
  return Order.findOne({where: {id: order_id}})
    .then(function(order) {
      if (order.get('status') !== 'draft') {
        throw {error: {key: 'ALREADY_CONFIRMED', value: "no se puede vaciar un pedido que no esta en borrador"}, status: 400}
      }

      // TODO: ponerlo en una transaccion
      return OrderItem.destroy({where: {order_id: order_id} })
      	.then(function() {
      		return order.update({total_price: 0, currency: null}, {hooks: false});
      	})
      	.then(function() {
      		return Order.findOne({where: {id: order_id}, include: {model: Client}})
      	});
    });
  
};

module.exports = OrderItem;