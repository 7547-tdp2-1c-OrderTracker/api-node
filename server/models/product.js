var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var Brand = require("./brand");

var Product = sequelize.define('products', {
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
  },
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE
}, {
  freezeTableName: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

Product.belongsTo(Brand, {foreignKey: 'brand_id'});

module.exports = Product;