var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Brand = require("./brand");
var Product = require("./product");

var Promotion = sequelize.define('promotions', {
  name: Sequelize.STRING,
  percent: Sequelize.INTEGER,
  begin_date: Sequelize.DATE,
  end_date: Sequelize.DATE,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Promotion.belongsTo(Brand, {foreignKey: 'brand_id'});
Promotion.belongsTo(Product, {foreignKey: 'product_id'});

module.exports = Promotion;