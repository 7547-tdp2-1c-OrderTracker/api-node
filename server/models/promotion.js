var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Brand = require("./brand");
var Product = require("./product");
var q = require("q");
var _ = require("underscore");

var push = q.denodeify(require("../domain/push").pushNewPromotionNotification);

var afterCreate = function(instance, options) {
	return push(instance.get("id"), instance.get("name")).catch(console.error.bind(console));
};

var Promotion = sequelize.define('promotions', {
  name: Sequelize.STRING,
  min_quantity: {type: Sequelize.INTEGER, defaultValue: 0},
  percent: Sequelize.INTEGER,
  begin_date: Sequelize.DATE,
  end_date: Sequelize.DATE,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
  hooks: {
  	afterCreate: afterCreate
  }
});

Promotion.belongsTo(Brand, {foreignKey: 'brand_id'});
Promotion.belongsTo(Product, {foreignKey: 'product_id'});

Brand.hasMany(Promotion, {foreignKey: 'brand_id'});
Product.hasMany(Promotion, {foreignKey: 'product_id'});

module.exports = Promotion;