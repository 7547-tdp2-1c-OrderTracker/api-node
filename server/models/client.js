var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var Seller = require("./seller");

var Client = sequelize.define('clients', {
  name: Sequelize.STRING,
  lastname: Sequelize.STRING,
  avatar: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  cuil: Sequelize.STRING,
  address: Sequelize.STRING,
  phone_number: Sequelize.STRING,
  email: Sequelize.STRING,
  lat: Sequelize.REAL,
  lon: Sequelize.REAL,
  sellerType: {
  	type: Sequelize.STRING,
  	field: 'seller_type'
  },
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE
}, {
  freezeTableName: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

Client.belongsTo(Seller, {foreignKey: 'seller_id'})

module.exports = Client;