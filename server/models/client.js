var sequelize_endpoint = require("../sequelize_endpoint");
var Sequelize = require("sequelize");

module.exports = sequelize_endpoint.sequelize.define('clients', {
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
  }
}, {
  freezeTableName: true,
  timestamps: false
});

