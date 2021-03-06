var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var Brand = require("./brand");
var Seller = require("./seller")
var Device = require("./device");
var q = require("q");

var push = q.denodeify(require("../domain/push").pushProductStockedNotification);

var afterUpdate = function(instance, options) {
  if (options.fields.indexOf("stock") !== -1) {
    if (instance._previousDataValues.stock == 0 && instance.dataValues.stock > 0) {
      // si se esta modificando el stock desde cero Y ademas se le asinga un valor mayor que cero
      return push(instance.get("id"), instance.get("name"), instance.get("thumbnail")||instance.get("picture"))
          .catch(console.error.bind(console)); /* los errores de push no afectan al update del registro */

    }
  }
};

var beforeDestroy = function(instance, options) {
  sequelize.onlyAdmin(instance, options);

  return sequelize.query("DELETE FROM products_categories WHERE product_id = ?", 
    {replacements: [instance.id]});
};

var Product = sequelize.define('products', {
  name: Sequelize.STRING,
  code: Sequelize.STRING,
  description: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  picture: Sequelize.STRING,
  currency: Sequelize.STRING(4),
  stock: Sequelize.INTEGER,
  status: Sequelize.INTEGER,
  wholesalePrice: {
  	type: Sequelize.INTEGER,
  	field: 'wholesale_price'
  },
  retailPrice: {
  	type: Sequelize.INTEGER,
  	field: 'retail_price'
  },
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
  hooks: {
    beforeUpdate: sequelize.onlyAdmin,
    beforeCreate: sequelize.onlyAdmin,
    beforeDestroy: beforeDestroy,
    afterUpdate: afterUpdate
  }
});

Product.belongsTo(Brand, {foreignKey: 'brand_id'});

module.exports = Product;