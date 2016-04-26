var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");

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
  timestamps: false
});

Order.belongsTo(Client, {foreignKey: 'client_id'});

module.exports = Order;