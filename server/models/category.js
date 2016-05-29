var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Product = require("./product");

var beforeDestroy = function(instance, options) {
  sequelize.onlyAdmin(instance, options);

  return sequelize.query("DELETE FROM products_categories WHERE category_id = ?", 
    {replacements: [instance.id]});
};


var Category = sequelize.define('categories', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  hooks: {
  	beforeUpdate: sequelize.onlyAdmin,
  	beforeCreate: sequelize.onlyAdmin,
    beforeDestroy: beforeDestroy
  },
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Category.belongsToMany(Product, {through: "products_categories", foreignKey: 'category_id'});
Product.belongsToMany(Category, {through: "products_categories", foreignKey: 'product_id'});

module.exports = Category;