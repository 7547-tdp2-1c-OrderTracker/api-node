var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var pg = require("pg");
var q = require("q");

var Order = require("./order");
var Product = require("./product");

// TODO: usar sequelize en vez de escribir las queries
var pgConnect = q.denodeify(function(url, callback) {
	pg.connect(url, function(err, client, done) {
		callback(err, {
			client: client,
			done: done
		});
	});
});

var updateOrderTotalPrice = function(instance, options) {
	var order_id = instance.order_id;
	var order_entry_id = instance.id;

	return pgConnect(process.env.DATABASE_URL).then(function(connection) {
		var client = connection.client;
		var query = q.denodeify(client.query.bind(client));

		return query("select clients.seller_type from clients join orders on orders.client_id = clients.id where orders.id = $1::int", [order_id])
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

				return query(denormalize, [order_entry_id])
					.then(function() {
						var text = "UPDATE orders SET currency=(SELECT currency FROM order_entries WHERE order_id=$1::int LIMIT 1), total_price=(SELECT coalesce(sum(unit_price * quantity),0) FROM order_entries WHERE order_id=$1::int) WHERE id=$1::int";
						return query(text, [order_id]);
					})
					.catch(function(err) {
						console.error(err);
					});
			})
			.finally(connection.done);
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
  currency: Sequelize.STRING(4)
}, {
  freezeTableName: true,
  tableName: 'order_entries',
  timestamps: false,
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

module.exports = OrderItem;