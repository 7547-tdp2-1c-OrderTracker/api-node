var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");
var Product = require("./product");
var Seller = require("./seller");

var beforeCreate = function(instance, options) {
  // no permitir crear el pedido nuevo, si ya existen orders del mismo cliente y vendedor
  return Order.findOne({
    attributes: [[sequelize.fn('COUNT', sequelize.col("*")), "count"]],
    where: {
      client_id: instance.get("client_id"),
      status: 'draft'
    }
  }).then(function(count) {
    if (count.get('count') > 0) {
      throw {
        error: {
          key: 'DRAFT_LIMIT_REACHED', 
          value: 'se alcanzo el numero maximo de pedidos en borrador para ese seller y cliente'
        }, 
        status: 400
      };
    }
  });
};

var transition = {
  draft: {
    confirmed: function(order, instance, options) {
        var decrementStock = "UPDATE products as p SET stock=stock-oe.quantity FROM order_entries as oe WHERE p.id = oe.product_id AND oe.order_id = ?;";
        var OrderItem = require("./order_item");
        return OrderItem.findAll({where: {order_id: instance.id}, include:{model: Product}})
          .then(function(order_items) {
            if (order_items.length) {
              // si no todos tienen stock
              var hasStock = function(order_item) {
                return order_item.get('product').get('stock') - order_item.get('quantity') >= 0;
              };

              if (!order_items.every(hasStock)) {
                var order_item_ids = order_items.filter(function(order_item) {
                    return !hasStock(order_item);
                  }).map(function(order_item){ return order_item.get("id"); });

                throw {error: {key: 'NO_STOCK', value: 'no se puede confirmar el pedido porque no alcanza el stock, order_item_ids: ' + JSON.stringify(order_item_ids)}, status: 400};
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
    },
    cancelled: function(order, instance, options) {
      // pasar el order de draft a cancelled no implica ninguna validacion
    }
  },

  confirmed: {
    delivered: function(){},
    intransit: function(){},
    prepared: function(){}
  },
  prepared: {
    delivered: function(){},
    intransit: function(){}
  },
  intransit: {
    delivered: function(){},
    prepared: function(){}
  }
};

var beforeUpdate = function(instance, options) {
  sequelize.checkAllowed(["status", "delivery_date"], options);

  return Order.findOne({where: {id: instance.id}})
    .then(function(order) {
      // si no se esta modificando ningun campo, puede pasar
      if (options.fields.length === 0) return;

      // si se esta modificando el status
      if (options.fields.indexOf("status") !== -1) {
        var currentStatus = order.get('status');
        var newStatus = instance.status;

        if (newStatus !== currentStatus) {
          var t = transition[currentStatus];
          if (!t) {
            throw {error: {key: "INVALID_STATE_CHANGE", value: "no se cambiar desde el status " + currentStatus}, status: 400};
          }

          var transitionFunc = t[newStatus];

          if (!transitionFunc) {
            throw {error: {key: "INVALID_STATE_CHANGE", value: "no se cambiar el status desde " + currentStatus + " a " + newStatus}, status: 400};
          }

          return transitionFunc(order, instance, options);
        }
      }

      // si se esta modificando otros campos
      if (order.get('status') !== 'draft') {
        // falla si esta en confirmed
        throw {error: {key: 'ALREADY_CONFIRMED', value: "solo se pueden modificar pedidos en draft"}, status: 400}
      }
    });
};


var Order = sequelize.define('orders', {
  delivery_date: Sequelize.DATE,
  status: {
  	type: Sequelize.STRING,
  	defaultValue: 'draft',
    validate: {
      isIn: [['draft', 'cancelled', 'confirmed', 'prepared', 'intransit', 'delivered']]
    }
  },
  total_price: {
  	type: Sequelize.INTEGER,
  	defaultValue: 0
  },
  currency: Sequelize.STRING(4),
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate: beforeCreate,
    beforeUpdate: beforeUpdate
  },
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Order.belongsTo(Client, {foreignKey: 'client_id'});
Order.belongsTo(Seller, {foreignKey: 'seller_id'});

module.exports = Order;