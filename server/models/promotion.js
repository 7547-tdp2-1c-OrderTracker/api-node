var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Brand = require("./brand");
var Product = require("./product");
var q = require("q");
var _ = require("underscore");

var push = q.denodeify(require("../domain/push").pushNewPromotionNotification);

var afterCreate = function(instance, options) {
	if(instance.get(brand)){
		return push(instance.get("id"), instance.get("name"),instance.get('percent'),instance.get('brand').get('name')).catch(console.error.bind(console));
	}else{
		return push(instance.get("id"), instance.get("name"),instance.get('percent'),instance.get('product').get('name')).catch(console.error.bind(console));		
	}
};

var beforeCreate = function(instance, options) {
	sequelize.onlyAdmin(instance, options);

	if (instance.product_id && instance.brand_id) {
		throw {error: {key: 'BAD_PROMOTION', value: "una promocion no puede se de un producto y una marca a la vez"}, status: 400};
	}
};

var beforeUpdate = function(instance, options) {
	sequelize.onlyAdmin(instance, options);

	if (options.fields.indexOf("product_id") !== -1 && options.fields.indexOf("brand_id") !== -1) {
		throw {error: {key: 'BAD_PROMOTION', value: "una promocion no puede se de un producto y una marca a la vez"}, status: 400};
	}

	if (options.fields.indexOf("product_id") !== -1) {
		instance.brand_id = null;
	}

	if (options.fields.indexOf("brand_id") !== -1) {
		instance.product_id = null;
	}
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
  	beforeCreate: beforeCreate,
  	beforeUpdate: beforeUpdate,
  	afterCreate: afterCreate
  }
});

Promotion.belongsTo(Brand, {foreignKey: 'brand_id'});
Promotion.belongsTo(Product, {foreignKey: 'product_id'});

Brand.hasMany(Promotion, {foreignKey: 'brand_id'});
Product.hasMany(Promotion, {foreignKey: 'product_id'});

module.exports = Promotion;