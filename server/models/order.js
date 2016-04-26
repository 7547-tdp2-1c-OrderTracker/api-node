var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");

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


var Order = sequelize.define('orders', {
  delivery_date: Sequelize.DATE,
  date_created: {
  	type: Sequelize.DATE,
  	defaultValue: Sequelize.NOW
  },
  status: {
  	type: Sequelize.STRING,
  	defaultValue: 'draft'
  },
  total_price: {
  	type: Sequelize.INTEGER,
  	defaultValue: 0
  },
  currency: Sequelize.STRING(4),
  vendor_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  timestamps: false,
  hooks: {
    beforeCreate: beforeCreate
  }
});

Order.belongsTo(Client, {foreignKey: 'client_id'});

module.exports = Order;