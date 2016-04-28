var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var q = require("q");

var Order = require("./order");
var Product = require("./product");
var Client = require("./client");
var Brand = require("./brand")

var updateOrderTotalPrice = function(instance, options) {
	var order_id = instance.order_id;
	var order_entry_id = instance.id;

	var updateTotals = "UPDATE orders SET currency=?, total_price=(SELECT coalesce(sum(unit_price * quantity),0) FROM order_entries WHERE order_id=?) WHERE id=?"
	return Order.find({where: {id: order_id}, include: [{model: Client}]})
		.then(function(order) {
			var seller_type = order.get("client").get('sellerType');
			var price_column;

			if (seller_type.slice(0,8) === "retail") {
				price_column = "retailPrice";
			} else if (seller_type.slice(0,8) === "wholesal") {
				price_column = "wholesalePrice";
			} else {
				return;
			}

			return Product.findOne({where: {id: instance.product_id}, include: [{model: Brand}]})
				.then(function(product) {
					if (!product) return;

					return instance.update({
						unit_price: product.get(price_column),
						currency: product.get("currency"),
						thumbnail: product.get("thumbnail"),
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
	return Order.findOne({where: {id: order_id, status: {$ne: 'confirmed'}}})
		.then(function(result) {
			// si no devuelve resultados, es porque el pedido no esta confirmado y no 
			// se permite modificar el item
			if (!result) {
				throw {error: {key: 'ALREADY_CONFIRMED', value: errormsg}, status: 400}
			}
		});
};

var stockControl = function(product_id, quantity) {
	return Product.findOne({where: {id: product_id, stock: {$gte: quantity}}})
		.then(function(result) {
			// si no devuelve resultados, significa que no hay stock suficiente del producto
			if (!result) {
				throw {error: {key: 'NO_STOCK', value: "No hay suficientes unidades del producto"}, status: 400}
			}
		});
};

var beforeUpdate = function(instance, options) {
	sequelize.checkAllowed(["quantity", "updatedAt", "createdAt"], options);

	var order_id = instance.get('order_id');
	return validateConfirmed(order_id, "no se puede modificar un item de un pedido que ya fue confirmado")
		.then(function() {
			return stockControl(instance.get('product_id'), instance.get('quantity'))
		});
};

var beforeCreate = function(instance, options) {
	var order_id = instance.get('order_id');
	return validateConfirmed(order_id, "no se puede crear un item para un pedido que ya fue confirmado")
		.then(function() {
			return stockControl(instance.get('product_id'), instance.get('quantity'))
		});
};

var OrderItem = sequelize.define('order_items', {
  name: Sequelize.STRING,
  brand_name: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  quantity: Sequelize.INTEGER,
  unit_price: Sequelize.INTEGER,
  order_id: Sequelize.INTEGER,
  product_id: Sequelize.INTEGER,
  currency: Sequelize.STRING(4),
  createdAt: {
    field: 'created_at',
    type: Sequelize.DATE
  },
  updatedAt: {
    field: 'updated_at',
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  tableName: 'order_entries',
  hooks: {
  	beforeUpdate: beforeUpdate,
  	beforeCreate: beforeCreate,
  	afterCreate: updateOrderTotalPrice,
  	afterDestroy: updateOrderTotalPrice,
  	afterUpdate: updateOrderTotalPrice
  }
});

OrderItem.belongsTo(Order, {foreignKey: 'order_id'});
Order.hasMany(OrderItem, {foreignKey: 'order_id'});

OrderItem.belongsTo(Product, {foreignKey: 'product_id'});

Order.empty = function(order_id) {
  return Order.findOne({where: {id: order_id}})
    .then(function(order) {
      if (order.get('status') === 'confirmed') {
        throw {error: {key: 'ALREADY_CONFIRMED', value: "no se puede vaciar un pedido que ya esta confirmado"}, status: 400}
      }

      // TODO: ponerlo en una transaccion
      return OrderItem.destroy({where: {order_id: order_id} })
      	.then(function() {
      		return order.update({total_price: 0, currency: null});
      	});
    });
  
};

module.exports = OrderItem;