var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");
var Product = require("./product");

var beforeCreate = function(instance, options) {
  // no permitir crear el pedido nuevo, si ya existen orders del mismo cliente y vendedor
  return Order.findOne({
    attributes: [[sequelize.fn('COUNT', sequelize.col("*")), "count"]],
    where: {
      vendor_id: instance.get("vendor_id"), 
      client_id: instance.get("client_id"),
      status: 'draft'
    }
  }).then(function(count) {
    if (count.get('count') > 0) {
      throw {
        error: {
          key: 'DRAFT_LIMIT_REACHED', 
          value: 'se alcanzo el numero maximo de pedidos en borrador para ese vendor y cliente'
        }, 
        status: 400
      };
    }
  });
};

var beforeUpdate = function(instance, options) {

  var OrderItem = require("./order_item");
  var decrementStock = "UPDATE products as p SET stock=stock-oe.quantity FROM order_entries as oe WHERE p.id = oe.product_id AND oe.order_id = ?;";

  return Order.findOne({where: {id: instance.id}})
    .then(function(order) {
      if (order.get('status') === 'confirmed') {
        // si el status del order es confirmed, no se permite su modificacion
        // a no ser q la operacion de put no modifique nada ({"status": "confirmed"})
        // asi, se evita dar error por los put repetidos para poner el pedido en confirmed
        if (options.fields.length === 0) return;
        if (options.fields.length === 1 && options.fields[0] === "status" && instance.status === 'confirmed') return;

        throw {error: {key: 'ALREADY_CONFIRMED', value: "no se puede modificar un pedido que ya esta confirmado"}, status: 400}
      } else if (order.get('status') === 'draft'){
        // si el pedido esta en draft, puede pasar a confirmed si hay suficiente stock de todos los productos
        if (instance.status === "confirmed") {
            return OrderItem.findAll({where: {order_id: instance.id}, include:{model: Product}})
              .then(function(order_items) {
                if (order_items.length) {
                  // si no todos tienen stock
                  var hasStock = function(order_item) {
                    console.log(order_item.get('product').get('stock'));
                    console.log(order_item.get('quantity'));
                    return order_item.get('product').get('stock') - order_item.get('quantity') >= 0;
                  };

                  if (!order_items.every(hasStock)) {
                    throw {error: {key: 'NO_STOCK', value: 'no se puede confirmar el pedido porque no alcanza el stock'}, status: 400};
                  } else {
                    // decrementar el stock de todos los productos
                    return sequelize.query(decrementStock, {replacements: [instance.id]})
                      .then(function() {
                        return order.update(instance);
                      });
                  }
                }
              })
              .then(function() {
                return instance;
              })
              .catch(function(err) {
                console.error(err);
                throw err;
              });
        }
      } else {
        // si el pedido esta en otro estado que no sea draft ni confirmed, el cambio es invalido si modifica el status
        // a un valor diferente al que esta
        if (options.fields.length === 0) return;
        if (options.fields.indexOf("status") !== -1) return; // si no se esta modificando el status es valido
        if (instance.status === order.get("status")) return; // si se modifica el status a lo mismo, tambien es valido

        throw {error: {key: 'INVALID_STATE_CHANGE', value: "no se puede modificar el estado del pedido"}, status: 400}
      }
    });
};


var Order = sequelize.define('orders', {
  delivery_date: Sequelize.DATE,
  status: {
  	type: Sequelize.STRING,
  	defaultValue: 'draft'
  },
  total_price: {
  	type: Sequelize.INTEGER,
  	defaultValue: 0
  },
  currency: Sequelize.STRING(4),
  vendor_id: Sequelize.INTEGER,
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
  hooks: {
    beforeCreate: beforeCreate,
    beforeUpdate: beforeUpdate
  }
});

Order.belongsTo(Client, {foreignKey: 'client_id'});

module.exports = Order;