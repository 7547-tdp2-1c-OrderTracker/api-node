var sequelize_endpoint = require("../sequelize_endpoint");
var Sequelize = require("sequelize");

var Brand = require("./brand");

var Product = sequelize_endpoint.sequelize.define('products', {
  name: Sequelize.STRING,
  code: Sequelize.STRING,
  description: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  picture: Sequelize.STRING,
  stock: Sequelize.STRING,
  currency: Sequelize.STRING(4),
  stock: Sequelize.INTEGER,
  status: Sequelize.INTEGER,
  wholesalePrice: {
  	type: Sequelize.STRING,
  	field: 'wholesale_price'
  },
  retailPrice: {
  	type: Sequelize.STRING,
  	field: 'retail_price'
  }
}, {
  freezeTableName: true,
  timestamps: false
});

Product.belongsTo(Brand, {foreignKey: 'brand_id'});

module.exports = Product;