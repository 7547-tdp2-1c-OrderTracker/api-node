var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");

// FIXME: evitar tener una copia del model brand
var Brand = sequelize_endpoint.sequelize.define('brands', {
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  code: Sequelize.STRING
}, {
  freezeTableName: true,
  timestamps: false
});

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

var where = function(req, res) {
	if (req.query.brand_id) {
		var p = function(x){return parseInt(x);}
		var brand_ids = req.query.brand_id.split(",").map(p);

		return {brand_id: {$in: brand_ids}};
	} else {
		return {};
	}
};

module.exports = sequelize_endpoint(Product, {
	where: where	
});
